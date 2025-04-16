ALTER TABLE "InventoryItem" ADD COLUMN "itemType" text NOT NULL;--> statement-breakpoint
ALTER TABLE "InventoryItem" ADD COLUMN "buffs" json NOT NULL;--> statement-breakpoint
ALTER TABLE "InventoryItem" DROP COLUMN IF EXISTS "effect";