CREATE TABLE IF NOT EXISTS "Character" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"chatId" uuid NOT NULL,
	"name" text NOT NULL,
	"race" text NOT NULL,
	"class" text NOT NULL,
	"physicalTraits" text NOT NULL,
	"weapon" text NOT NULL,
	"strength" text NOT NULL,
	"weakness" text NOT NULL,
	"companion" text NOT NULL,
	"symbol" text NOT NULL,
	"avatar" text,
	"health" integer NOT NULL,
	"mana" integer NOT NULL,
	"attack" integer NOT NULL,
	"defense" integer NOT NULL,
	"speed" integer NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "Document";--> statement-breakpoint
DROP TABLE "Suggestion";--> statement-breakpoint
DROP TABLE "Vote";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Character" ADD CONSTRAINT "Character_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
