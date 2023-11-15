"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const semver = __importStar(require("semver"));
async function run() {
    try {
        const currentVersion = core.getInput('current_version');
        const bumpLevel = core.getInput('level');
        // @ts-ignore github actions output variables are just constants declared in the async top level scope
        const new_version = await bumpSemver(currentVersion, bumpLevel);
    }
    catch (e) {
        core.error(e);
        core.setFailed(e.message);
    }
}
async function bumpSemver(currentVersion, bumpLevel) {
    if (!semver.valid(currentVersion)) {
        throw new Error(`${currentVersion} is not a valid semver`);
    }
    if (!isReleaseType(bumpLevel)) {
        throw new Error(`${bumpLevel} is not supported. {major, premajor, minor, preminor, patch, prepatch, prerelease} is available.`);
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
