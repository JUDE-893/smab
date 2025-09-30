import { Router } from 'express';
import { redirectAuthorizedRegister, checkInvitation, inviteUser }
        from '../controllers/inviteController.js';
import { protect, verifiedAccess}  from '../controllers/authController.js';

const router = Router();

// router.use(protect, verifiedAccess)

router.post('/', inviteUser);

router.get('/invitation/:token', checkInvitation, redirectAuthorizedRegister);



export default router;
