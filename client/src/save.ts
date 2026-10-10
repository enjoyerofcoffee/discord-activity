import type { History } from "./context/GameState";
import { accessToken } from "./discord";

// Outside of Discord there is no user, so nothing is loaded or saved.

export const loadHistory = async (): Promise<History[]> => {
  if (!accessToken) return [];

  const response = await fetch("/api/game", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return [];

  const { history } = await response.json();
  return history;
};

export const saveHistory = async (history: History[]) => {
  if (!accessToken) return;

  await fetch("/api/game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ history }),
  });
};
