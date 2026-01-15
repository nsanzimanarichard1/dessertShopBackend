import { login } from "../controllers/authController";
import { Router } from "express"
const routes = Router();


routes.post("/login",login)

export default routes;