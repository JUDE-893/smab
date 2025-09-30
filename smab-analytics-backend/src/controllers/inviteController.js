import { errorCatchingLayer, signJWT, setJwtCookie, verifyJWT } from '../utils/helpers.js';
import { sendMail } from '../utils/mailServices.js';
import { accountInvitationMail } from '../templates/mail.js';
import AppError from '../utils/AppError.js';
import Invited from '../models/invitedModel.js'
import crypto from 'crypto'

async function sendAccountInvitationMail(req, user) {
  const mailtemp = accountInvitationMail({protocol: req.protocol, host: req.get('host'), user, token})
  // send email
  await sendMail({
      from: `SMAB Analytics <ayoub.arif541@gmail.com>`,
      to: user.email,
      subject: "You are invited to SMAB Analytics dashboard",
      text: 'null',
      html: mailtemp
    })
    // .catch((e) => next(new AppError("Can't send email verification",500)))
}

// CONTROLLERS
export const inviteUser = errorCatchingLayer(async (req, res, next) => {

  const currentDate = new Date();
  let token = crypto.randomBytes(32).toString('hex');
  const timeoutMinutes = Number(process.env.AUTHORIZATION_TOKEN_TIMEOUT) || 21600,
  authorizationTokenExpiresAt = new Date(
    currentDate.getTime() + timeoutMinutes * 60 * 1000
  );
  const invited = await Invited.create({
    issuer: req?.user?._id,
    email: req.body.email,
    authorizationToken: token,
    authorizationTokenExpiresAt
  })

  await sendAccountInvitationMail(req, req.user)

  res.status(201).json({message: 'Invitation mail was sent to invited user successfully'})
})

export const checkInvitation = errorCatchingLayer(async (req, res, next) => {

  let token = req.params.authoToken;

  let invited = await Invited.findOne({
    authorizationToken: token,
  });

  const valid = invited.verifyAuthorizationToken();

  if (!valid) {
    return next(new AppError('Invalid or missing authorization token. Please try again or Resend invitation request', 401));
  };

  invited = await invited.save();

  req.invited = invited;
  return next()
})

export const redirectAuthorizedRegister = errorCatchingLayer(async (req, res, next) => {

  const invited = req.invited;

  // response
  return res.redirect(`${process.env.CLIENT_SCHEME}/register/${invited?.authorizationToken}`);

})
