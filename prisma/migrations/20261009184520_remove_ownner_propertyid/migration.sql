/*
  Warnings:

  - You are about to drop the column `ownerId` on the `properties` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "properties_ownerId_idx";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "ownerId";

-- CreateIndex
CREATE INDEX "properties_providerId_idx" ON "properties"("providerId");
