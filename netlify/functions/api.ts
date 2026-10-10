import serverless from "serverless-http";
import { app } from "../../server/src/app.ts";

// Runs the Express app as a Netlify Function
export const handler = serverless(app);
