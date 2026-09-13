/**
 * Utility functions for release versions.
 */
function isPrereleaseVersion(version) {
  if (!version || typeof version !== 'string') return false;
  return /-(alpha|beta|rc|canary|nightly|preview)/i.test(version);
}

module.exports = {
  isPrereleaseVersion,
};
