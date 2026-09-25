-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'SUBLET', 'ROOM', 'BACHELOR_ROOM', 'FAMILY_APARTMENT', 'SHARED_APARTMENT', 'HOSTEL');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'RENTED', 'UNAVAILABLE', 'REJECTED');

-- CreateEnum
CREATE TYPE "FurnishedStatus" AS ENUM ('FURNISHED', 'UNFURNISHED', 'SEMI_FURNISHED');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('SINGLE', 'DOUBLE', 'SHARED', 'MASTER', 'PRIVATE', 'BACHELOR', 'FAMILY');

-- CreateEnum
CREATE TYPE "Lifestyle" AS ENUM ('QUIET', 'SOCIAL', 'BALANCED');

-- CreateEnum
CREATE TYPE "FoodPreference" AS ENUM ('VEG', 'NON_VEG', 'BOTH', 'ANY');

-- CreateEnum
CREATE TYPE "RoommateListingStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'MATCHED', 'CLOSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RoommateRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('MONTHLY_RENT', 'SECURITY_DEPOSIT', 'BOOKING_FEE', 'SERVICE_FEE');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('FAKE_PROPERTY', 'FAKE_ROOMMATE', 'WRONG_INFORMATION', 'SCAM', 'INAPPROPRIATE_CONTENT', 'HARASSMENT', 'DUPLICATE_LISTING', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RENTAL_REQUEST', 'RENTAL_APPROVED', 'RENTAL_REJECTED', 'RENTAL_CANCELLED', 'ROOMMATE_REQUEST', 'ROOMMATE_ACCEPTED', 'ROOMMATE_REJECTED', 'ROOMMATE_MATCH', 'PROPERTY_APPROVED', 'PROPERTY_REJECTED', 'PROPERTY_STATUS_CHANGED', 'BOOKING_CONFIRMED', 'PAYMENT_CONFIRMED', 'NEW_MESSAGE', 'GENERAL');

-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('EMAIL_VERIFICATION', 'FORGOT_PASSWORD');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'BLOCK', 'UNBLOCK', 'LOGIN', 'LOGOUT', 'PAYMENT', 'OTHER');

-- DropEnum
DROP TYPE "DoctorVerificationStatus";

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL DEFAULT 'HOUSE',
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "area" TEXT,
    "rent" DECIMAL(12,2) NOT NULL,
    "securityDeposit" DECIMAL(12,2),
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "availableRooms" INTEGER NOT NULL DEFAULT 1,
    "furnished" "FurnishedStatus" NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "imagePublicId" TEXT NOT NULL DEFAULT '',
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "status" "PropertyStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "properties_ownerId_idx" ON "properties"("ownerId");
