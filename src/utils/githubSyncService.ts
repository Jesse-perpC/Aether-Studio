import { AppRecord, GitHubBranch, GitHubSyncConfig, WorkspaceCommit } from "../types";
import { generateDualWorkspaceStructure } from "./workspaceStructureGenerator";

export interface GitHubRepoInfo {
  fullName: string;
  owner: string;
  name: string;
  defaultBranch: string;
  isPrivate: boolean;
  canPush: boolean;
  htmlUrl: string;
}

export interface SyncResult {
  success: boolean;
  commit?: WorkspaceCommit;
  totalFiles: number;
  webFilesCount: number;
  desktopFilesCount: number;
  mobileFilesCount: number;
  workflowFilesCount: number;
  rootFilesCount: number;
  error?: string;
}

export interface FetchBranchesResult {
  ok: boolean;
  branches: GitHubBranch[];
  defaultBranch?: string;
  error?: string;
}

/**
 * Parses user input into GitHub owner and repository name.
 * Handles inputs like "owner/repo", "https://github.com/owner/repo", "git@github.com:owner/repo.git".
 */
export function parseGitHubRepo(input: string): { owner: string; repo: string } | null {
  if (!input) return null;
  const clean = input.trim().replace(/\.git$/, "");
  
  // URL matching
  const urlMatch = clean.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+)/);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2] };
  }

  // SSH matching
  const sshMatch = clean.match(/git@github\.com:([^/]+)\/([^/]+)/);
  if (sshMatch) {
    return { owner: sshMatch[1], repo: sshMatch[2] };
  }

  // Simple "owner/repo" matching
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 2 && !parts[0].includes(" ")) {
    return { owner: parts[0], repo: parts[1] };
  }

  return null;
}

/**
 * Validates connection, token permissions, and repository visibility via GitHub API.
 */
export async function testGitHubConnection(
  repoUrl: string,
  token: string
): Promise<{ ok: boolean; repoInfo?: GitHubRepoInfo; error?: string }> {
  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed) {
    return {
      ok: false,
      error: "Invalid repository format. Please enter as 'owner/repo' or 'https://github.com/owner/repo'.",
    };
  }

  if (!token || !token.trim()) {
    return {
      ok: false,
      error: "GitHub Personal Access Token is required to authenticate.",
    };
  }

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Aether-Studio-Applet",
      Authorization: `Bearer ${token.trim()}`,
    };

    const res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, {
      headers,
    });

    if (res.status === 401) {
      return {
        ok: false,
        error: "Authentication failed. Check that your Personal Access Token is valid and unexpired.",
      };
    }

    if (res.status === 404) {
      return {
        ok: false,
        error: `Repository '${parsed.owner}/${parsed.repo}' not found. Make sure the repository exists and your token has access.`,
      };
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        ok: false,
        error: errJson.message || `GitHub API returned HTTP ${res.status}.`,
      };
    }

    const data = await res.json();
    const canPush = Boolean(data.permissions?.push || data.permissions?.admin);

    return {
      ok: true,
      repoInfo: {
        fullName: data.full_name,
        owner: data.owner?.login || parsed.owner,
        name: data.name || parsed.repo,
        defaultBranch: data.default_branch || "main",
        isPrivate: Boolean(data.private),
        canPush,
        htmlUrl: data.html_url,
      },
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message || "Failed to reach GitHub API. Check network connectivity.",
    };
  }
}

/**
 * Fetches all active branches from the GitHub repository.
 */
export async function fetchGitHubBranches(
  repoUrl: string,
  token: string
): Promise<FetchBranchesResult> {
  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed || !token?.trim()) {
    return {
      ok: false,
      branches: [],
      error: "Valid repository and Personal Access Token are required.",
    };
  }

  try {
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Aether-Studio-Applet",
      Authorization: `Bearer ${token.trim()}`,
    };

    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/branches?per_page=100`,
      { headers }
    );

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        ok: false,
        branches: [],
        error: errJson.message || `Failed to fetch branches (HTTP ${res.status})`,
      };
    }

    const data = await res.json();
    const branches: GitHubBranch[] = data.map((b: any) => ({
      name: b.name,
      commitSha: b.commit?.sha || "",
      isProtected: Boolean(b.protected),
      isDefault: b.name === "main" || b.name === "master",
    }));

    return {
      ok: true,
      branches,
    };
  } catch (err: any) {
    return {
      ok: false,
      branches: [],
      error: err.message || "Network error while fetching repository branches.",
    };
  }
}

/**
 * Creates a new branch on the GitHub repository from an existing base branch.
 */
export async function createGitHubBranch(
  repoUrl: string,
  token: string,
  newBranch: string,
  fromBranch = "main"
): Promise<{ ok: boolean; branchName?: string; error?: string }> {
  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed || !token?.trim()) {
    return { ok: false, error: "Repository and token required." };
  }

  const cleanBranch = newBranch.trim().replace(/^refs\/heads\//, "");
  if (!cleanBranch) {
    return { ok: false, error: "Branch name cannot be empty." };
  }

  try {
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Aether-Studio-Applet",
      Authorization: `Bearer ${token.trim()}`,
      "Content-Type": "application/json",
    };

    // 1. Get SHA of source branch
    const baseRefRes = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/ref/heads/${fromBranch}`,
      { headers }
    );

    if (!baseRefRes.ok) {
      return {
        ok: false,
        error: `Could not find source branch '${fromBranch}' to branch from.`,
      };
    }

    const baseRefData = await baseRefRes.json();
    const baseSha = baseRefData.object?.sha;
    if (!baseSha) {
      return { ok: false, error: `Invalid SHA for source branch '${fromBranch}'.` };
    }

    // 2. Create new ref
    const createRes = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/refs`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${cleanBranch}`,
          sha: baseSha,
        }),
      }
    );

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      return {
        ok: false,
        error: err.message || `Failed to create branch '${cleanBranch}' (HTTP ${createRes.status})`,
      };
    }

    return { ok: true, branchName: cleanBranch };
  } catch (err: any) {
    return { ok: false, error: err.message || "Failed to create new branch on GitHub." };
  }
}

/**
 * Synchronizes the current workspace state to GitHub, creating desktop, web, mobile,
 * and automated GitHub Action CI/CD workflow files.
 */
export async function syncWorkspaceToGitHub(
  config: GitHubSyncConfig,
  app: AppRecord,
  commitMessage: string
): Promise<SyncResult> {
  const dualStructure = generateDualWorkspaceStructure(app);
  const totalFiles = Object.keys(dualStructure.files).length;

  const parsed = parseGitHubRepo(config.repoUrl);
  if (!parsed) {
    return {
      success: false,
      totalFiles,
      webFilesCount: dualStructure.webFilesCount,
      desktopFilesCount: dualStructure.desktopFilesCount,
      mobileFilesCount: dualStructure.mobileFilesCount,
      workflowFilesCount: dualStructure.workflowFilesCount,
      rootFilesCount: dualStructure.rootFilesCount,
      error: "Invalid repository format. Please configure 'owner/repo' in GitHub Sync settings.",
    };
  }

  if (!config.token || !config.token.trim()) {
    return {
      success: false,
      totalFiles,
      webFilesCount: dualStructure.webFilesCount,
      desktopFilesCount: dualStructure.desktopFilesCount,
      mobileFilesCount: dualStructure.mobileFilesCount,
      workflowFilesCount: dualStructure.workflowFilesCount,
      rootFilesCount: dualStructure.rootFilesCount,
      error: "GitHub token missing. Please provide a Personal Access Token with 'repo' scope.",
    };
  }

  const branch = (config.branch || "main").trim();
  const token = config.token.trim();
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Aether-Studio-Applet",
    Authorization: `Bearer ${token}`,
  };

  try {
    // 1. Get branch reference
    let refSha: string | null = null;
    let baseTreeSha: string | null = null;

    const refRes = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/ref/heads/${branch}`,
      { headers }
    );

    if (refRes.ok) {
      const refData = await refRes.json();
      refSha = refData.object?.sha;

      // Get latest commit to find its tree
      if (refSha) {
        const commitRes = await fetch(
          `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/commits/${refSha}`,
          { headers }
        );
        if (commitRes.ok) {
          const commitData = await commitRes.json();
          baseTreeSha = commitData.tree?.sha || null;
        }
      }
    }

    // 2. Prepare tree items for all targets (Web, Desktop, Mobile, Workflows, Root)
    const treeItems = Object.entries(dualStructure.files).map(([path, content]) => ({
      path,
      mode: "100644",
      type: "blob",
      content,
    }));

    // 3. Create tree on GitHub
    const treePayload: any = {
      tree: treeItems,
    };
    if (baseTreeSha) {
      treePayload.base_tree = baseTreeSha;
    }

    const treeRes = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(treePayload),
      }
    );

    if (!treeRes.ok) {
      const errData = await treeRes.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to create Git tree (HTTP ${treeRes.status})`);
    }

    const newTree = await treeRes.json();

    // 4. Create commit on GitHub
    const formattedCommitMessage = `${commitMessage}\n\n[Aether Studio] Multi-Target Workspace Synchronization:\n- 🌐 Web Target: Vite + React 19 (/web)\n- 💻 Desktop Target: Electron 40 + Forge Windows/macOS/Linux (/desktop)\n- 📱 Mobile Target: Android APK + Capacitor (/mobile)\n- ⚙️ CI/CD Automation: Android APK & Windows App workflow (.github/workflows/build-and-release.yml)\n- Total Files: ${totalFiles} across all targets`;

    const commitPayload: any = {
      message: formattedCommitMessage,
      tree: newTree.sha,
    };
    if (refSha) {
      commitPayload.parents = [refSha];
    }

    const commitRes = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/commits`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(commitPayload),
      }
    );

    if (!commitRes.ok) {
      const errData = await commitRes.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to create Git commit (HTTP ${commitRes.status})`);
    }

    const newCommit = await commitRes.json();
    const commitSha = newCommit.sha;
    const shortSha = commitSha.slice(0, 7);

    // 5. Update or create branch reference
    if (refSha) {
      // Branch exists: PATCH ref
      const updateRefRes = await fetch(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/refs/heads/${branch}`,
        {
          method: "PATCH",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ sha: commitSha, force: false }),
        }
      );
      if (!updateRefRes.ok) {
        const errData = await updateRefRes.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to update ref heads/${branch}`);
      }
    } else {
      // Branch does not exist: POST new ref
      const createRefRes = await fetch(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/refs`,
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commitSha }),
        }
      );
      if (!createRefRes.ok) {
        const errData = await createRefRes.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to initialize branch heads/${branch}`);
      }
    }

    const commitRecord: WorkspaceCommit = {
      id: `commit-${Date.now()}`,
      hash: shortSha,
      message: commitMessage,
      author: "Aether Agent & Developer",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      filesChanged: Object.keys(dualStructure.files),
      syncedToGitHub: true,
      githubCommitUrl: `https://github.com/${parsed.owner}/${parsed.repo}/commit/${commitSha}`,
    };

    return {
      success: true,
      commit: commitRecord,
      totalFiles,
      webFilesCount: dualStructure.webFilesCount,
      desktopFilesCount: dualStructure.desktopFilesCount,
      mobileFilesCount: dualStructure.mobileFilesCount,
      workflowFilesCount: dualStructure.workflowFilesCount,
      rootFilesCount: dualStructure.rootFilesCount,
    };
  } catch (error: any) {
    // Sanitize any token from error output
    const cleanMsg = (error.message || "Unknown error during sync").replace(
      new RegExp(token, "g"),
      "ghp_••••••••"
    );

    return {
      success: false,
      totalFiles,
      webFilesCount: dualStructure.webFilesCount,
      desktopFilesCount: dualStructure.desktopFilesCount,
      mobileFilesCount: dualStructure.mobileFilesCount,
      workflowFilesCount: dualStructure.workflowFilesCount,
      rootFilesCount: dualStructure.rootFilesCount,
      error: cleanMsg,
    };
  }
}
