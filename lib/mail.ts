/** SMTP configuration for Mailpit (dev) or production mail server */

export type MailConfig = {
  host: string;
  port: number;
  from: string;
};

export function getMailConfig(): MailConfig {
  return {
    host: process.env.SMTP_HOST ?? "localhost",
    port: Number(process.env.SMTP_PORT ?? 1025),
    from: process.env.SMTP_FROM ?? "noreply@barberpro.local",
  };
}

/** Mailpit web UI — http://localhost:8025 when running via Docker Compose */
export function getMailpitUrl(): string {
  return process.env.MAILPIT_URL ?? "http://localhost:8025";
}
