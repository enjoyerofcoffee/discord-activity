import { DiscordSDK } from "@discord/embedded-app-sdk";

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

export let accessToken = "";

export const setupDiscord = async (): Promise<DiscordUser | null> => {
  if (!discordSdk) return null;

  await discordSdk.ready();

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

export const getParticipants = async (): Promise<Participant[]> => {
  if (!discordSdk) {
    return [];
  }

  const { participants } =
    await discordSdk.commands.getInstanceConnectedParticipants();

  return participants;
};
