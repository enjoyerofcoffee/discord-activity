import { DiscordSDK } from "@discord/embedded-app-sdk";

// Discord adds frame_id to the URL when it opens the activity.
// Outside of Discord (plain browser) the SDK cannot be created.
export const isInDiscord = new URLSearchParams(window.location.search).has(
  "frame_id",
);

const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID ?? "";

const discordSdk = isInDiscord ? new DiscordSDK(clientId) : null;

export type DiscordUser = Awaited<
  ReturnType<DiscordSDK["commands"]["authenticate"]>
>["user"];

export type Participant = Awaited<
  ReturnType<DiscordSDK["commands"]["getInstanceConnectedParticipants"]>
>["participants"][number];

// Set after login, the server uses it to know who is saving a game
export let accessToken = "";

export const setupDiscord = async (): Promise<DiscordUser | null> => {
  if (!discordSdk) return null;

  await discordSdk.ready();

  // Ask the Discord client for a code, the server swaps it for an access token
  const { code } = await discordSdk.commands.authorize({
    client_id: clientId,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: ["identify"],
  });

  const response = await fetch("/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) throw new Error("Could not get a Discord access token");

  const { access_token } = await response.json();
  const auth = await discordSdk.commands.authenticate({ access_token });
  accessToken = access_token;

  return auth.user;
};

// Everyone who currently has the activity open in the same channel
export const getParticipants = async (): Promise<Participant[]> => {
  if (!discordSdk) {
    return [];
  }

  const { participants } =
    await discordSdk.commands.getInstanceConnectedParticipants();

  return participants;
};
