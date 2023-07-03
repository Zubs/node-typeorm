import { Router } from 'express';
import { registerNewUser } from "../controllers/authController";

const router = Router();

router.post('/auth/register', registerNewUser);

export default router;
