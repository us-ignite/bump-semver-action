const core = require("@actions/core");
const semver = require("semver");

async function run() {
  var version = "";
  try {
    const currentVersion = core.getInput('current_version');
    const bumpLevel = core.getInput('level');
    version = await bumpSemver(currentVersion, bumpLevel);

  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
  const new_version = version;
}

async function bumpSemver(
  currentVersion,
  bumpLevel
) {
  if (!semver.valid(currentVersion)) {
    throw new Error(`${currentVersion} is not a valid semver`);
  }

  if (!isReleaseType(bumpLevel)) {
    throw new Error(
      `${bumpLevel} is not supported. {major, premajor, minor, preminor, patch, prepatch, prerelease} is available.`
    );
  }

  // https://semver.org/#is-v123-a-semantic-version
  // If the current version has 'v' prefix (e.g., v1.2.3), keep the prefix in the new version too.
  const hasVPrefix = currentVersion.startsWith('v');

  const bumpedVersion = semver.inc(currentVersion, bumpLevel);

  let newVersion = bumpedVersion;
  if (hasVPrefix) {
    newVersion = `v${newVersion}`;
  }

  return newVersion;
}

function isReleaseType(s) {
  return [
    'major',
    'premajor',
    'minor',
    'preminor',
    'patch',
    'prepatch',
    'prerelease'
  ].includes(s);
}

run();
