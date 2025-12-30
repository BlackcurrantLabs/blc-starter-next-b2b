// This file sends out various emails required by the application
// For a new email, make a new function that takes the necessary props

// Use Resend to send emails
// Use react-email to construct emails in the emails folder

import 'server-only';
import { Resend } from "resend";

import VerifyEmail from '../emails/verify-email';
import { ResetPasswordEmail } from '../emails/reset-password-email';
import MagicLinkEmail from '../emails/magic-link-email';


const resend = new Resend(process.env.RESEND_KEY);

export async function sendResetPasswordEmail(email:string, name: string, url: string) {
  return resend.emails.send({
    from: process.env.RESEND_FROM as string,
    to: email,
    subject: `Reset password for ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    text: `Click the link to reset password for ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    react: <ResetPasswordEmail name={name} link={url} />,
  })
}

export async function sendVerificationEmail(email:string, name: string, url: string) {
  return resend.emails.send({
    from: process.env.RESEND_FROM as string,
    to: email,
    subject: `Verify email for ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    text: `Click the link to verify email for ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    react: <VerifyEmail name={name} link={url} />,
  })
}

export async function sendMagicLinkEmail(email:string, url: string) {
  return resend.emails.send({
    from: process.env.RESEND_FROM as string,
    to: email,
    subject: `Verify email for ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    text: `Click the link to verify email for ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    react: <MagicLinkEmail link={url} />,
  })
}