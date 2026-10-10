import express, { type Express, type Request, type Response } from "express";
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile("../.env");

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SECRET_KEY ?? "",
);

const app: Express = express();

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

const getToday = () => new Date().toISOString().slice(0, 10);

app.get("/api/game", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  if (!userId) {
    res.status(401).send({ error: "Not logged in" });
    return;
  }

  const { data, error } = await supabase
    .from("games")
    .select("history")
    .eq("user_id", userId)
    .eq("date", getToday())
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

  // Replaces the row when this user already has a game saved for today
  const { error } = await supabase
    .from("games")
    .upsert({ user_id: userId, date: getToday(), history: req.body.history });

  if (error) {
    res.status(500).send({ error: "Could not save the game" });
    return;
  }

  res.send({ ok: true });
});

app.listen(3000);
