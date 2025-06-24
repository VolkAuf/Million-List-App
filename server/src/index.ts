import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import itemRouter from "@/routes/itemRouter";

dotenv.config();
const app = express();
const CLIENT_URL = process.env.CLIENT_URL;
const HOSTNAME = process.env.HOSTNAME;
const PORT = process.env.PORT || 3000;
const DOCS_ROUTE = "/api-docs";

const allowedOrigins = [CLIENT_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(DOCS_ROUTE, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/items", itemRouter);

/**
 * @openapi
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 */
app.listen(PORT, () => {
  console.log(`Server running at ${HOSTNAME}:${PORT}`);
  console.log(`Docs available at ${HOSTNAME}:${PORT}${DOCS_ROUTE}`);
});
