CREATE TABLE IF NOT EXISTS "InventoryItem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"characterId" uuid NOT NULL,
	"name" text NOT NULL,
	"identified" boolean DEFAULT false NOT NULL,
	"rarity" text NOT NULL,
	"description" text NOT NULL,
	"effect" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Character" ADD COLUMN "gold" integer DEFAULT 20 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_characterId_Character_id_fk" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
