CREATE TABLE IF NOT EXISTS "HealTimestamp" (
	"characterId" uuid NOT NULL,
	"lastHeal" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HealTimestamp" ADD CONSTRAINT "HealTimestamp_characterId_Character_id_fk" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
