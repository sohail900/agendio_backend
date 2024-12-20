-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "recurringType" DROP NOT NULL,
ALTER COLUMN "recurringType" DROP DEFAULT;
