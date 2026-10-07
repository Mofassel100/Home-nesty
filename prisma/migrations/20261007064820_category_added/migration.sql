/*
  Warnings:

  - The values [APARTMENT] on the enum `PropertyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PropertyCategory" AS ENUM ('RESIDENTIAL', 'FAMILY', 'BACHELOR', 'STUDENT', 'HOSTEL', 'SUBLET', 'COMMERCIAL', 'OFFICE', 'RETAIL', 'SHOP');

-- AlterEnum
BEGIN;
CREATE TYPE "PropertyType_new" AS ENUM ('FLAT', 'HOUSE', 'ROOM', 'SEAT', 'SUBLET', 'HOSTEL', 'BACHELOR_ROOM', 'FAMILY_APARTMENT', 'SHARED_APARTMENT');
ALTER TABLE "public"."properties" ALTER COLUMN "propertyType" DROP DEFAULT;
ALTER TABLE "properties" ALTER COLUMN "propertyType" TYPE "PropertyType_new" USING ("propertyType"::text::"PropertyType_new");
ALTER TYPE "PropertyType" RENAME TO "PropertyType_old";
ALTER TYPE "PropertyType_new" RENAME TO "PropertyType";
DROP TYPE "public"."PropertyType_old";
ALTER TABLE "properties" ALTER COLUMN "propertyType" SET DEFAULT 'HOUSE';
COMMIT;

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "category" "PropertyCategory" NOT NULL DEFAULT 'HOSTEL';
