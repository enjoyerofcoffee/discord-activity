import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { isInDiscord, setupDiscord, type DiscordUser } from "../discord";

type Status = "loading" | "ready" | "error";

const DiscordUserContext = createContext<DiscordUser | null>(null);

export const DiscordProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [status, setStatus] = useState<Status>(
    isInDiscord ? "loading" : "ready",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isInDiscord) return;

    const connect = async () => {
      const user = await setupDiscord().catch((error) => {
        console.error(error);
        setError(error.message ?? JSON.stringify(error));
        setStatus("error");
        return undefined;
      });
      if (user === undefined) return;

      setUser(user);
      setStatus("ready");
    };

    connect();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex h-dvh items-center justify-center gap-2">
        <span className="loading loading-spinner loading-lg" />
        Connecting to Discord...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-2">
        <span>Could not connect to Discord</span>
        <span className="text-error">{error}</span>
      </div>
    );
  }

  return <DiscordUserContext value={user}>{children}</DiscordUserContext>;
};

export const useDiscordUser = () => useContext(DiscordUserContext);
