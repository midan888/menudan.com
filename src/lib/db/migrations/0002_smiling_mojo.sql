ALTER TABLE "tenants" ADD COLUMN "default_currency" varchar(3) DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "enabled_currencies" jsonb DEFAULT '["USD"]'::jsonb;