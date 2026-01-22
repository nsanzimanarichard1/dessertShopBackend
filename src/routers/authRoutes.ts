import { login } from "../controllers/authController";
import { Router } from "express"
const routes = Router();


routes.post("/login",login)
routes.post("/login/admin", login)

export default routes;