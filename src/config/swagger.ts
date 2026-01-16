import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dessert Shop API",
      version: "1.0.0",
      description:
        "API documentation for authentication, products, categories, cart, and orders",
    },

    servers: [
      {
        url: "https://dessertshopbackend.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
