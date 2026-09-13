/**
 * Windows signing configuration for Electron Forge.
 * Uses Azure Trusted Signing if configured in the environment.
 */
export const windowsSign = process.env.WINDOWS_SIGN === "true" && process.env.AZURE_METADATA_JSON
  ? {
      signWithParams: `/v /fd SHA256 /tr "http://timestamp.acs.microsoft.com" /td SHA256 /dlib "${process.env.AZURE_CODE_SIGNING_DLIB || ''}" /dmdf "${process.env.AZURE_METADATA_JSON || ''}"`,
    }
  : undefined;
