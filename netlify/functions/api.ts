import express from "express";
import serverless from "serverless-http";
import { apiRouter } from "../../api-router";

const app = express();

app.use(express.json());

// Mount the router at the root since serverless-http will strip the basePath
app.use("/", apiRouter);

// Configure serverless-http to strip the Netlify function path
export const handler = serverless(app, {
  basePath: '/.netlify/functions/api'
});
