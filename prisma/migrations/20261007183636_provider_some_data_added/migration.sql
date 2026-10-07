/*
  Warnings:

  - You are about to drop the column `tradeLicenseDoc` on the `Provider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "tradeLicenseDoc",
ADD COLUMN     "additionalFiles" JSONB,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nidPublicId" TEXT,
ADD COLUMN     "verificationStatus" "ProviderStatus" NOT NULL DEFAULT 'PENDING';
