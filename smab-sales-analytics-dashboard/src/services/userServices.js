import axiosClient from './axiosClient';

/* User SERVICES */

export const sendVerificationMail = async function() {
  const result = await axiosClient.post('/proxy/authenticated', { target: 'auth/resend-verification-mail' })


  return result
}

export const sendPasswordResetRequest = async function(data) {
  const result = await axiosClient.post('/proxy/public', { target: 'auth/forgot-password', data })

  return result
}

export const resetPassword = async function({ token, data }) {
  const result = await axiosClient.post('/proxy/public', { target: 'auth/resetPassword/'+ token, data })

  return result
}
