import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { useCallback } from "react";
import { loginRequest, tokenRequest } from "./msalConfig";

export function useAuth() {
  const { instance, inProgress, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount(accounts[0] || {});

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
