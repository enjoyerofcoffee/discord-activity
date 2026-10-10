import type { History } from "./context/GameState";
import { accessToken } from "./discord";

export const loadHistory = async (seed: number): Promise<History[]> => {
  if (!accessToken) {
    return [];
  }

  const response = await fetch(`/api/game?seed=${seed}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    return [];
  }

  const { history } = await response.json();
  return history;
};

export const saveHistory = async (seed: number, history: History[]) => {
  if (!accessToken) {
    return;
  }

  await fetch("/api/game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ seed, history }),
  });
};

export type PlayerProgress = {
  userId: string;
  percentages: number[]; // one per guess, the guessed countries stay hidden
};

export const loadPlayers = async (
  seed: number,
  userIds: string[],
): Promise<PlayerProgress[]> => {
  if (!accessToken || userIds.length === 0) {
    return [];
  }

  const response = await fetch(
    `/api/players?seed=${seed}&ids=${userIds.join(",")}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!response.ok) {
    return [];
  }

  const { players } = await response.json();
  return players;
};
