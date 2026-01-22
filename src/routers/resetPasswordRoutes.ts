import { Express } from "express";
import { Router } from "express";
import { forgotPassword } from "../controllers/forgot-password";
import { resetPassword } from "../controllers/resetPasswordToken";

 const router = Router()



router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password/:token", resetPassword);

// export router to use in app.ts 
    export default router;