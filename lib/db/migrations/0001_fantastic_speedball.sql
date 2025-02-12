CREATE TABLE IF NOT EXISTS "GlobalProgress" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"lastUpdated" timestamp DEFAULT now() NOT NULL
);
