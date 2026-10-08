import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { HttpError, handle, requireSession } from "@/lib/http";
import { toRepoDTO } from "@/lib/service";
import Repository from "@/models/Repository";

const escape = (s: string) =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const SORTS: Record<string, Record<string, 1 | -1>> = {
  stars: { stars: -1 },
  forks: { forks: -1 },
  updated: { pushedAt: -1 },
  created: { createdAt: -1 },
  name: { name: 1 },
};

interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
  html_url?: string;
}

interface ContributorDTO {
  username: string;
  avatar: string;
  url: string;
  commits: number;
  percentage: number;
}

/**
 * Get all contributors of a GitHub repository.
 */
async function getContributors(
  repoUrl: string
): Promise<ContributorDTO[]> {
  try {
    const url = new URL(repoUrl);

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    if (parts.length < 2) {
      return [];
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    /*
     * GitHub normally returns 30 contributors.
     * We request 100 so we can show more contributors.
     */
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(
        owner
      )}/${encodeURIComponent(
        repo
      )}/contributors?per_page=100`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `GitHub contributors error for ${owner}/${repo}:`,
        response.status
      );

      return [];
    }

    const contributors =
      (await response.json()) as GitHubContributor[];

    if (!Array.isArray(contributors) || contributors.length === 0) {
      return [];
    }

    const totalContributions = contributors.reduce(
      (total, contributor) =>
        total + Number(contributor.contributions || 0),
      0
    );

    if (totalContributions <= 0) {
      return contributors.map((contributor) => ({
        username: contributor.login,
        avatar: contributor.avatar_url || "",
        url:
          contributor.html_url ||
          `https://github.com/${contributor.login}`,
        commits: Number(contributor.contributions || 0),
        percentage: 0,
      }));
    }

    return contributors.map((contributor) => ({
      username: contributor.login,
      avatar: contributor.avatar_url || "",
      url:
        contributor.html_url ||
        `https://github.com/${contributor.login}`,
      commits: Number(contributor.contributions || 0),
      percentage: Number(
        (
          (Number(contributor.contributions || 0) /
            totalContributions) *
          100
        ).toFixed(1)
      ),
    }));
  } catch (error) {
    console.error("GET CONTRIBUTORS ERROR:", error);
    return [];
  }
}

/** Search / filter the stored repositories of an analyzed user. */
export const GET = handle(async (req) => {
  await requireSession();

  const sp = req.nextUrl.searchParams;

  const username = (sp.get("username") ?? "")
    .trim()
    .toLowerCase();

  if (!username) {
    throw new HttpError(400, "username is required");
  }

  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {
    usernameLower: username,
  };

  const q = (sp.get("q") ?? "").trim();

  const language = sp.get("language") ?? "";

  if (language) {
    filter.language = language;
  }

  if (sp.get("forks") !== "1") {
    filter.fork = { $ne: true };
  }

  if (q) {
    const re = new RegExp(escape(q), "i");

    filter.$or = [
      { name: re },
      { description: re },
      { topics: re },
    ];
  }

  const sort =
    SORTS[sp.get("sort") ?? "stars"] ?? SORTS.stars;

  const [docs, languages] = await Promise.all([
    Repository.find(filter)
      .sort(sort)
      .limit(300)
      .lean(),

    Repository.distinct("language", {
      usernameLower: username,
      language: { $ne: null },
    }),
  ]);

  /*
   * Convert repositories to the DTO used by the frontend.
   */
  const repoDTOs = docs.map(toRepoDTO);

  /*
   * Fetch GitHub contributors for every repository.
   *
   * We use a small concurrency limit so that 300 repositories
   * don't send 300 requests to GitHub simultaneously.
   */
  const contributorsByRepo = new Map<
    string,
    ContributorDTO[]
  >();

  const batchSize = 5;

  for (let i = 0; i < repoDTOs.length; i += batchSize) {
    const batch = repoDTOs.slice(i, i + batchSize);

    const results = await Promise.all(
      batch.map(async (repo) => {
        const contributors = await getContributors(repo.url);

        return {
          repoId: String(repo.repoId),
          contributors,
        };
      })
    );

    for (const result of results) {
      contributorsByRepo.set(
        result.repoId,
        result.contributors
      );
    }
  }

  /*
   * Add contributors to every repository.
   */
  const repos = repoDTOs.map((repo) => {
    const contributors =
      contributorsByRepo.get(String(repo.repoId)) ?? [];

    return {
      ...repo,
      contributors,
    };
  });

  return NextResponse.json({
    repos,
    languages: (languages as string[]).sort(),
    total: repos.length,
  });
});