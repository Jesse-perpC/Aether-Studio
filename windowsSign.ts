import type { SignToolOptions } from "@electron/windows-sign";

const dlib = process.env.AZURE_CODE_SIGNING_DLIB;
const metadata = process.env.AZURE_METADATA_JSON;
const signToolPath = process.env.SIGNTOOL_PATH;

/**
 * Windows code signing configuration for Electron Forge and Electron Packager.
 * Supports Azure Trusted Signing (dlib + metadata) or standard Windows signtool.
 */
export const windowsSign: SignToolOptions = {
  ...(signToolPath ? { signToolPath } : {}),
  ...(dlib && metadata
    ? {
        signWithParams: `/v /fd SHA256 /tr "http://timestamp.acs.microsoft.com" /td SHA256 /dlib "${dlib}" /dmdf "${metadata}"`,
      }
    : {}),
};

export default windowsSign;
