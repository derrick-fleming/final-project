
set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public.accounts" (
	"accountId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	"joinedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "accounts_pk" PRIMARY KEY ("accountId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.reviews" (
	"reviewId" serial NOT NULL,
	"accountId" int NOT NULL,
	"parkCode" TEXT NOT NULL,
	"rating" int NOT NULL,
	"datesVisited" daterange NOT NULL,
	"recommendedActivities" TEXT NOT NULL,
	"recommendedVisitors" TEXT NOT NULL,
	"tips" TEXT NOT NULL,
	"generalThoughts" TEXT,
	"imageUrl" TEXT,
	"postedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "reviews_pk" PRIMARY KEY ("reviewId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.parksCache" (
	"parkCode" TEXT NOT NULL,
	"details" json NOT NULL,
	"stateCode" TEXT NOT NULL,
	CONSTRAINT "parksCache_pk" PRIMARY KEY ("parkCode")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk0" FOREIGN KEY ("accountId") REFERENCES "accounts"("accountId");
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk1" FOREIGN KEY ("parkCode") REFERENCES "parksCache"("parkCode");
