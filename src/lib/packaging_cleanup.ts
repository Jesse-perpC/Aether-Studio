import fs from "fs-extra";
import path from "path";

/**
 * Prunes unneeded files from packaged node_modules / app directory before ASAR packaging.
 * Strips non-signable scripts (.ps1) and non-target architecture prebuilds that cause signtool errors.
 */
export async function removeUnusedAppPackageFiles(
  buildPath: string,
  platform: string,
  _arch: string,
): Promise<void> {
  try {
    if (platform === "win32") {
      const pathsToRemove = [
        path.join(buildPath, "node_modules", "node-pty", "deps", "winpty", "misc"),
        path.join(buildPath, "node_modules", "node-pty", "prebuilds", "darwin-arm64"),
        path.join(buildPath, "node_modules", "node-pty", "prebuilds", "darwin-x64"),
        path.join(buildPath, "node_modules", "node-pty", "prebuilds", "linux-x64"),
        path.join(buildPath, "node_modules", "node-pty", "prebuilds", "linux-arm64"),
      ];
      for (const p of pathsToRemove) {
        if (await fs.pathExists(p)) {
          await fs.remove(p);
        }
      }
    }
  } catch (err) {
    console.warn("removeUnusedAppPackageFiles warning:", err);
  }
}

/**
 * Prunes unused extra resources (e.g. dugite Git Credential Manager binaries) before packaging.
 */
export async function removeUnusedCopiedResources(
  buildPath: string,
  _platform: string,
): Promise<void> {
  try {
    const gcmPaths = [
      path.join(buildPath, "resources", "git", "libexec", "git-core", "git-credential-manager"),
      path.join(buildPath, "resources", "git", "libexec", "git-core", "git-credential-manager.exe"),
      path.join(buildPath, "resources", "git", "mingw64", "libexec", "git-core", "git-credential-manager.exe"),
    ];
    for (const p of gcmPaths) {
      if (await fs.pathExists(p)) {
        await fs.remove(p);
      }
    }
  } catch (err) {
    console.warn("removeUnusedCopiedResources warning:", err);
  }
}
