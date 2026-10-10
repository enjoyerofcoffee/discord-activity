import express, { type Express, type Request, type Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { getDailySeed } from "../../shared/daily.ts";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SECRET_KEY ?? "",
);

export const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/api/token", async (req: Request, res: Response) => {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.VITE_DISCORD_CLIENT_ID ?? "",
      client_secret: process.env.DISCORD_CLIENT_SECRET ?? "",
      grant_type: "authorization_code",
      code: req.body.code,
    }),
  });

  if (!response.ok) {
    res.status(response.status).send({ error: "Token exchange failed" });
    return;
  }

  const { access_token } = await response.json();
  res.send({ access_token });
});

const getUserId = async (req: Request): Promise<string | null> => {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: req.headers.authorization ?? "" },
  });
  if (!response.ok) return null;

  const user = await response.json();
  return user.id;
};

// Yesterday is allowed for players who are still playing when the day changes
const isValidSeed = (seed: number) => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return seed === getDailySeed() || seed === getDailySeed(yesterday);
};

app.get("/api/game", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  if (!userId) {
    res.status(401).send({ error: "Not logged in" });
    return;
  }

  const seed = Number(req.query.seed);
  if (!isValidSeed(seed)) {
    res.status(400).send({ error: "Invalid seed" });
    return;
  }

  const { data, error } = await supabase
    .from("games")
    .select("history")
    .eq("user_id", userId)
    .eq("seed", seed)
    .maybeSingle();

  if (error) {
    res.status(500).send({ error: "Could not load the game" });
    return;
  }

  res.send({ history: data?.history ?? [] });
});

app.post("/api/game", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  if (!userId) {
    res.status(401).send({ error: "Not logged in" });
    return;
  }

  const { seed, history } = req.body;
  if (!isValidSeed(seed)) {
    res.status(400).send({ error: "Invalid seed" });
    return;
  }

  // Replaces the row when this user already has this game saved
  const { error } = await supabase
    .from("games")
    .upsert({ user_id: userId, seed, history });

  if (error) {
    res.status(500).send({ error: "Could not save the game" });
    return;
  }

  res.send({ ok: true });
});
