import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "../store/userStore";

export default function ClerkZustandSync() {
  const { user, isSignedIn } = useUser();
  const updateSettings = useUserStore((s) => s.updateSettings);

  useEffect(() => {
    if (isSignedIn && user) {
      // Read user metadata from Clerk and update Zustand
      const meta = user.publicMetadata || {};
      updateSettings({
        initialBalance: typeof meta.initialBalance === 'number' ? meta.initialBalance : Number(meta.initialBalance ?? 100),
        accountCurrency: typeof meta.accountCurrency === 'string' ? meta.accountCurrency : 'USD',
        riskPercentage: typeof meta.riskPercentage === 'number' ? meta.riskPercentage : Number(meta.riskPercentage ?? 1),
        darkMode: typeof meta.darkMode === 'boolean' ? meta.darkMode : Boolean(meta.darkMode ?? false),
        defaultPairs: Array.isArray(meta.defaultPairs) ? meta.defaultPairs as string[] : [],
        tags: Array.isArray(meta.tags) ? meta.tags as string[] : [],
        setups: Array.isArray(meta.setups) ? meta.setups as string[] : [],
      });
    }
  }, [isSignedIn, user, updateSettings]);

  return null;
}
