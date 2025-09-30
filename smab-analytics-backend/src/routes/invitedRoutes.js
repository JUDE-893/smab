import { Router } from 'express';
import { redirectAuthorizedRegister, checkInvitation, inviteUser, getRedirectToken }
        from '../controllers/inviteController.js';
import { protect, verifiedAccess}  from '../controllers/authController.js';

const router = Router();

router.get('/invitation/:authoToken', getRedirectToken, checkInvitation, redirectAuthorizedRegister);

router.use(protect, verifiedAccess)

router.post('/', inviteUser);




export default router;
