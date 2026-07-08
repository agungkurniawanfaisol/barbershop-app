-- Add WhatsApp tracking to transactions (idempotent)
ALTER TABLE "transactions"
ADD COLUMN IF NOT EXISTS "whatsapp_sent_at" TIMESTAMP(3);
