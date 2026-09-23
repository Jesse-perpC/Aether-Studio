/**
 * Utilities for determining release version attributes.
 */
export function isPrereleaseVersion(version) {
  if (!version || typeof version !== "string") return false;
  return version.includes("-");
}

export default {
  isPrereleaseVersion,
};
