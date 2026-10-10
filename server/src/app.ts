import express, { type Express, type Request, type Response } from "express";

process.loadEnvFile("../.env");

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

app.listen(3000);
