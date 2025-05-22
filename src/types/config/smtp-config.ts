/** SMTP configuration for email settings */
export interface SMTPConfig {
  /** Password for the SMTP server */
  password?: string

  /** Port for the SMTP server */
  port?: string

  /** SMTP server address */
  server?: string

  /** Username for the SMTP server */
  username?: string
}
