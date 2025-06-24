import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import itemRouter from "@/routes/itemRouter";

const app = express();
const HOSTNAME = "127.0.0.1";
const PORT = 3001;
const DOCS_ROUTE = "/api-docs";

app.use(cors());
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
  console.log(`Server running at http://${HOSTNAME}:${PORT}`);
  console.log(`Docs available at http://${HOSTNAME}:${PORT}${DOCS_ROUTE}`);
});
