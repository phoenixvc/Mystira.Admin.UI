import { MsalProvider } from "@azure/msal-react";
import { EventType, AuthenticationResult } from "@azure/msal-browser";
import { msalInstance } from "./msalInstance";
import { ReactNode, useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize();

        // Handle redirect promise after login redirect
        const response = await msalInstance.handleRedirectPromise();
        if (response) {
          console.log("Login redirect successful", response);
          // Set active account
          msalInstance.setActiveAccount(response.account);
        } else {
          // Check if there are any accounts already signed in
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0] || null);
          }
        }

        // Register event callbacks
        msalInstance.addEventCallback(event => {
          if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
            const payload = event.payload as AuthenticationResult;
            msalInstance.setActiveAccount(payload.account);
          }
        });

        setIsInitialized(true);
      } catch (error) {
        console.error("MSAL initialization failed:", error);
        setIsInitialized(true); // Still set to true to prevent infinite loading
      }
    };

    initializeMsal();
  }, []);

  if (!isInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
