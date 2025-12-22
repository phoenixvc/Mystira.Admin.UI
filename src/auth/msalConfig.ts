import { Configuration, LogLevel, PopupRequest } from "@azure/msal-browser";

// MSAL configuration for Entra ID (Azure AD)
// These values should be set in environment variables
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || "common"}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

// Scopes for login request
export const loginRequest: PopupRequest = {
  scopes: ["User.Read"],
};

// Scopes for token request
// Note: This should be configured in environment variables
// Format: api://{your-api-client-id}/.default or api://{your-api-client-id}/access_as_user
export const tokenRequest = {
  scopes: [import.meta.env.VITE_AZURE_API_SCOPE || "User.Read"],
};
