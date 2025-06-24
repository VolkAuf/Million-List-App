import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Million List API",
      version: "1.0.0",
      description: "API for working with a list of 1 million items",
    },
  },
  apis: ["./src/index.ts", "./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
