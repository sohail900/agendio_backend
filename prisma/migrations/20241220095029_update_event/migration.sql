/*
  Warnings:

  - You are about to drop the column `createdById` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[createdBy]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_createdById_fkey";

-- DropIndex
DROP INDEX "Event_createdById_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "createdById",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Event_createdBy_key" ON "Event"("createdBy");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
