export const passwordResetMail = ({token, mail}) => {
  let url = `${process.env.CLIENT_SCHEME}/reset-password/${token}`
  let text = `<p>You did submited a request for resetting your <strong>SMAB Analytics</strong> account password using this email address : ${mail}</p>
  <br/> To process please click the confirmation <a href='${url}'>link</a><br/>
  if you did not submit ant reset password request, you can safely ignore this email.
  `
  return text
}

export const accountVerificationMail = ({host, protocol, token, user}) => {
  let url = `${protocol}://${host}/smab-analytics/api/auth/verify-Account/${token}`
  let text = `<strong>Hello ${user.name} !</strong><br><p><strong>Welcome to SMAB</strong> —your account has been successfully created! We're thrilled to have you on board. To ensure a secure and seamless experience, you'll need to verify your identity. This step helps protect your account and grants you access to all the features SMAB Analytics dashboard has to offer.</p><br><br>
  <br/> To process please click this confirmation <a href='${url}'>link</a><br/>
  if you did not attempted to create a SMAB Analytics account using this mail : ${user.email}, you can safely ignore this email.<br><br>If you need any assistance, we're here to help!
  `
  return text
}
export const accountInvitationMail = ({ host, protocol, token, user }) => {
  const url = `${protocol}://${host}/smab-analytics/api/invite/invitation/${token}`;

  const text = `
    <strong>Hello,</strong><br><br
    <p>
      You have been invited to join <strong>SMAB Analytics</strong> by
      <strong>${user.name}</strong> (<a href="mailto:${user.email}">${user.email}</a>).
    </p>
    <p>
      SMAB Analytics is a powerful platform designed to help you unlock insights and make smarter, data‑driven decisions.
      To get started, please verify your identity by clicking the link below:
    </p>
    <p>
      <a href="${url}">Accept Invitation & Create Account</a>
    </p>
    <p>
      If you did not expect this invitation, you can safely ignore this email.
    </p>
    <p>
      We look forward to welcoming you on board.<br>
      <strong>The SMAB Analytics Team</strong>
    </p>
  `;

  return text;
};
