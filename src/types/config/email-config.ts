import { SMTPConfig } from './smtp-config.js'

/** Email configuration for sending reports via email */
export interface EmailConfig {
  /** Attachment for the email report */
  attachment?: string

  /** Blind carbon copy recipients */
  bcc?: string

  /** Body of the email */
  body?: string

  /** Carbon copy recipients */
  cc?: string

  /** Whether email reporting is enabled */
  enabled: boolean

  /** Format of the email report (e.g., Zip) */
  format: string

  /** Sender's email address */
  from?: string

  /** SMTP server configuration */
  smtp: SMTPConfig

  /** Subject of the email */
  subject?: string

  /** Recipient's email address */
  to?: string
}
