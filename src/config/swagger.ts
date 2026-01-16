import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dessert Shop API",
      version: "1.0.0",
      description: "API documentation for Products, Categories and Auth where user add product to cart for shopping",
    },
     servers: [
      {
        url: "https://dessertshopbackend.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:3000",
        description: "Local server",
      }],
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
  apis: ["./src/routers/*.ts"], // where swagger comments live
};

export const swaggerSpec = swaggerJsdoc(options);
