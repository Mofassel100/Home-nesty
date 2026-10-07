/*
  Warnings:

  - The values [SHOP] on the enum `PropertyCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [FLAT,SEAT] on the enum `PropertyType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `providerId` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "PropertyCategory_new" AS ENUM ('RESIDENTIAL', 'FAMILY', 'BACHELOR', 'STUDENT', 'HOSTEL', 'SUBLET', 'COMMERCIAL', 'OFFICE', 'RETAIL');
ALTER TABLE "public"."properties" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "properties" ALTER COLUMN "category" TYPE "PropertyCategory_new" USING ("category"::text::"PropertyCategory_new");
ALTER TYPE "PropertyCategory" RENAME TO "PropertyCategory_old";
ALTER TYPE "PropertyCategory_new" RENAME TO "PropertyCategory";
DROP TYPE "public"."PropertyCategory_old";
ALTER TABLE "properties" ALTER COLUMN "category" SET DEFAULT 'HOSTEL';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PropertyType_new" AS ENUM ('APARTMENT', 'HOUSE', 'SUBLET', 'ROOM', 'BACHELOR_ROOM', 'FAMILY_APARTMENT', 'SHARED_APARTMENT', 'HOSTEL');
ALTER TABLE "public"."properties" ALTER COLUMN "propertyType" DROP DEFAULT;
ALTER TABLE "properties" ALTER COLUMN "propertyType" TYPE "PropertyType_new" USING ("propertyType"::text::"PropertyType_new");
ALTER TYPE "PropertyType" RENAME TO "PropertyType_old";
ALTER TYPE "PropertyType_new" RENAME TO "PropertyType";
DROP TYPE "public"."PropertyType_old";
ALTER TABLE "properties" ALTER COLUMN "propertyType" SET DEFAULT 'HOUSE';
COMMIT;

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "providerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "nidNumber" TEXT,
    "tradeLicense" TEXT,
    "experience" INTEGER,
    "description" TEXT,
    "nidDocument" TEXT,
    "tradeLicenseDoc" TEXT,
    "profileImage" TEXT,
    "status" "ProviderStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Provider_userId_key" ON "Provider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_nidNumber_key" ON "Provider"("nidNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_tradeLicense_key" ON "Provider"("tradeLicense");

-- CreateIndex
CREATE INDEX "Provider_status_idx" ON "Provider"("status");

-- CreateIndex
CREATE INDEX "Provider_city_idx" ON "Provider"("city");

-- CreateIndex
CREATE INDEX "Provider_reviewedById_idx" ON "Provider"("reviewedById");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
