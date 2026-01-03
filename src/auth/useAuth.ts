import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { useCallback } from "react";
import { loginRequest, tokenRequest } from "./msalConfig";

const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === "true";

export function useAuth() {
  const { instance, inProgress, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount(accounts[0]);

  // Bypass authentication if environment variable is set
  if (BYPASS_AUTH) {
    return {
      isAuthenticated: true,
      isLoading: false,
      user: {
        username: "dev-user",
        name: "Development User",
        localAccountId: "bypass-auth-user",
      },
      login: async () => {
        console.log("Auth bypass enabled - login skipped");
      },
      logout: async () => {
        console.log("Auth bypass enabled - logout skipped");
      },
      getAccessToken: async () => {
        console.log("Auth bypass enabled - returning null token");
        return null;
      },
    };
  }

  const login = useCallback(async () => {
    if (inProgress !== InteractionStatus.None) return;

    try {
      // Try popup first, fall back to redirect if blocked
      await instance.loginPopup(loginRequest);
    } catch (popupError) {
      console.warn("Popup login failed, trying redirect:", popupError);
      await instance.loginRedirect(loginRequest);
    }
  }, [instance, inProgress]);

  const logout = useCallback(async () => {
    if (inProgress !== InteractionStatus.None) return;

    try {
      await instance.logoutPopup({
        mainWindowRedirectUri: "/login",
      });
    } catch (popupError) {
      console.warn("Popup logout failed, trying redirect:", popupError);
      await instance.logoutRedirect({
        postLogoutRedirectUri: "/login",
      });
    }
  }, [instance, inProgress]);

  const getAccessToken = useCallback(async () => {
    if (!account) return null;

    try {
      const response = await instance.acquireTokenSilent({
        ...tokenRequest,
        account,
      });
      return response.accessToken;
    } catch (error) {
      console.error("Silent token acquisition failed:", error);
      // Fall back to interactive method
      try {
        const response = await instance.acquireTokenPopup(tokenRequest);
        return response.accessToken;
      } catch (interactiveError) {
        console.error("Interactive token acquisition failed:", interactiveError);
        return null;
      }
    }
  }, [instance, account]);

  return {
    isAuthenticated,
    isLoading: inProgress !== InteractionStatus.None,
    user: account,
    login,
    logout,
    getAccessToken,
  };
}
