Yes. For your House & Roommate System, using Express.js + Prisma + PostgreSQL, below is a complete starting Prisma schema using your requested roles:

SUPER_ADMIN
ADMIN
CUSTOMER
PROVIDER

I’m keeping the source requirements as the basis and mapping the original USER role to CUSTOMER, while PROVIDER represents the property owner/landlord. The source itself defines USER as a person who can act as tenant, owner, or roommate seeker, so this is an implementation-level role split.

1. prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==============================
// ENUMS
// ==============================

enum Role {
  SUPER_ADMIN
  ADMIN
  CUSTOMER
  PROVIDER
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED
}

enum AuthProvider {
  LOCAL
  GOOGLE
}

enum PropertyType {
  APARTMENT
  HOUSE
  SUBLET
  ROOM
  BACHELOR_ROOM
  FAMILY_APARTMENT
  SHARED_APARTMENT
  HOSTEL
}

enum PropertyStatus {
  DRAFT
  PENDING
  PUBLISHED
  RENTED
  UNAVAILABLE
  REJECTED
}

enum FurnishedStatus {
  FURNISHED
  UNFURNISHED
  SEMI_FURNISHED
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum RoomType {
  SINGLE
  DOUBLE
  SHARED
  MASTER
  PRIVATE
  BACHELOR
  FAMILY
}

enum Lifestyle {
  QUIET
  SOCIAL
  BALANCED
}

enum FoodPreference {
  VEG
  NON_VEG
  BOTH
  ANY
}

enum RoommateListingStatus {
  DRAFT
  ACTIVE
  PAUSED
  MATCHED
  CLOSED
  REJECTED
}

enum RentalRequestStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}

enum RoommateRequestStatus {
  PENDING
  ACCEPTED
  REJECTED
  CANCELLED
}

enum BookingStatus {
  PENDING
  CONFIRMED
  ACTIVE
  COMPLETED
  CANCELLED
}

enum PaymentType {
  MONTHLY_RENT
  SECURITY_DEPOSIT
  BOOKING_FEE
  SERVICE_FEE
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum ReviewStatus {
  ACTIVE
  HIDDEN
  DELETED
}

enum ReportReason {
  FAKE_PROPERTY
  FAKE_ROOMMATE
  WRONG_INFORMATION
  SCAM
  INAPPROPRIATE_CONTENT
  HARASSMENT
  DUPLICATE_LISTING
  OTHER
}

enum ReportStatus {
  PENDING
  UNDER_REVIEW
  RESOLVED
  REJECTED
}

enum NotificationType {
  RENTAL_REQUEST
  RENTAL_APPROVED
  RENTAL_REJECTED
  RENTAL_CANCELLED
  ROOMMATE_REQUEST
  ROOMMATE_ACCEPTED
  ROOMMATE_REJECTED
  ROOMMATE_MATCH
  PROPERTY_APPROVED
  PROPERTY_REJECTED
  PROPERTY_STATUS_CHANGED
  BOOKING_CONFIRMED
  PAYMENT_CONFIRMED
  NEW_MESSAGE
  GENERAL
}

enum OtpType {
  EMAIL_VERIFICATION
  FORGOT_PASSWORD
}

enum MessageType {
  TEXT
  IMAGE
  FILE
}

enum MessageStatus {
  SENT
  DELIVERED
  READ
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  APPROVE
  REJECT
  BLOCK
  UNBLOCK
  LOGIN
  LOGOUT
  PAYMENT
  OTHER
}

// ==============================
// USER
// ==============================

model User {
  id            String       @id @default(uuid())
  name          String
  email         String       @unique
  password      String?
  phone         String?      @unique
  profileImage  String?
  role          Role         @default(CUSTOMER)
  status        UserStatus   @default(ACTIVE)
  authProvider  AuthProvider @default(LOCAL)
  emailVerified Boolean      @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Provider properties
  properties Property[]

  // Roommate
  roommateProfile  RoommateProfile?
  roommateListings RoommateListing[]

  // Rental requests
  rentalRequestsAsTenant RentalRequest[] @relation("RentalTenant")
  rentalRequestsAsOwner  RentalRequest[] @relation("RentalOwner")

  // Roommate requests
  sentRoommateRequests     RoommateRequest[] @relation("RoommateSender")
  receivedRoommateRequests RoommateRequest[] @relation("RoommateReceiver")

  // Booking
  tenantBookings Booking[] @relation("BookingTenant")
  ownerBookings  Booking[] @relation("BookingOwner")

  // Payments
  payments Payment[]

  // Reviews
  reviewsGiven Review[] @relation("Reviewer")
  ownerReviews Review[] @relation("OwnerReview")

  // Reports
  reportsCreated Report[] @relation("Reporter")
  reportsAgainst Report[] @relation("ReportedUser")

  // Notifications
  notifications Notification[]

  // Chat
  sentMessages     Message[] @relation("MessageSender")
  receivedMessages Message[] @relation("MessageReceiver")

  // OTP
  otps Otp[]

  // Audit
  auditLogs AuditLog[]

  @@index([email])
  @@index([role])
  @@index([status])
  @@map("users")
}

// ==============================
// PROPERTY
// ==============================

model Property {
  id              String          @id @default(uuid())
  ownerId         String
  title           String
  description     String
  propertyType    PropertyType
  address         String
  city            String
  area            String?
  rent            Decimal         @db.Decimal(12, 2)
  securityDeposit Decimal?        @db.Decimal(12, 2)
  bedrooms        Int
  bathrooms       Int
  availableRooms  Int             @default(1)
  furnished       FurnishedStatus
  availableFrom   DateTime
  amenities       String[]
  images          String[]
  contactName     String?
  contactPhone    String?
  contactEmail    String?
  status          PropertyStatus   @default(DRAFT)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  rooms Room[]

  rentalRequests RentalRequest[]
  bookings       Booking[]
  reviews        Review[]
  reports        Report[]

  @@index([ownerId])
  @@index([city])
  @@index([propertyType])
  @@index([rent])
  @@index([status])
  @@map("properties")
}

// ==============================
// ROOM
// Implementation extension because
// requirements mention roomId and room management.
// ==============================

model Room {
  id         String  @id @default(uuid())
  propertyId String

  name          String
  roomNumber    String?
  roomType      RoomType
  rent          Decimal @db.Decimal(12, 2)
  securityDeposit Decimal? @db.Decimal(12, 2)

  capacity      Int @default(1)
  availableBeds Int @default(1)

  furnished  FurnishedStatus?
  amenities  String[]
  images     String[]

  isAvailable Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  rentalRequests RentalRequest[]
  bookings       Booking[]

  @@index([propertyId])
  @@index([roomType])
  @@index([isAvailable])
  @@map("rooms")
}

// ==============================
// ROOMMATE PROFILE
// ==============================

model RoommateProfile {
  id     String @id @default(uuid())
  userId String @unique

  name             String?
  age              Int?
  gender           Gender?
  occupation       String?
  universityCompany String?
  location         String?
  budgetMin        Decimal? @db.Decimal(12, 2)
  budgetMax        Decimal? @db.Decimal(12, 2)
  preferredLocation String?
  moveInDate       DateTime?
  roomType         RoomType?
  smoking          Boolean @default(false)
  pets             Boolean @default(false)
  foodPreference   FoodPreference?
  lifestyle        Lifestyle?
  about            String?
  profileImage     String?

  status UserStatus @default(ACTIVE)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([location])
  @@index([budgetMin])
  @@index([budgetMax])
  @@map("roommate_profiles")
}

// ==============================
// ROOMMATE LISTING
// ==============================

model RoommateListing {
  id        String @id @default(uuid())
  userId    String

  title       String
  description String
  location    String
  rent        Decimal @db.Decimal(12, 2)

  availableFrom DateTime

  genderPreference     Gender?
  ageMin               Int?
  ageMax               Int?
  occupationPreference String?
  lifestylePreference  Lifestyle?
  roomType             RoomType?

  amenities String[]
  images    String[]

  status RoommateListingStatus @default(DRAFT)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  requests RoommateRequest[]

  reports Report[]

  @@index([userId])
  @@index([location])
  @@index([rent])
  @@index([status])
  @@map("roommate_listings")
}

// ==============================
// RENTAL REQUEST
// ==============================

model RentalRequest {
  id String @id @default(uuid())

  tenantId   String
  ownerId    String
  propertyId String
  roomId     String?

  message        String?
  moveInDate     DateTime
  numberOfPeople Int @default(1)

  status RentalRequestStatus @default(PENDING)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tenant User @relation("RentalTenant", fields: [tenantId], references: [id], onDelete: Cascade)
  owner  User @relation("RentalOwner", fields: [ownerId], references: [id], onDelete: Cascade)

  property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  room     Room?    @relation(fields: [roomId], references: [id], onDelete: SetNull)

  @@index([tenantId])
  @@index([ownerId])
  @@index([propertyId])
  @@index([status])
  @@map("rental_requests")
}

// ==============================
// ROOMMATE REQUEST
// ==============================

model RoommateRequest {
  id String @id @default(uuid())

  senderId   String
  receiverId String
  listingId  String

  message String?

  status RoommateRequestStatus @default(PENDING)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sender User @relation("RoommateSender", fields: [senderId], references: [id], onDelete: Cascade)

  receiver User @relation("RoommateReceiver", fields: [receiverId], references: [id], onDelete: Cascade)

  listing RoommateListing @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@index([senderId])
  @@index([receiverId])
  @@index([listingId])
  @@index([status])
  @@unique([senderId, receiverId, listingId])
  @@map("roommate_requests")
}

// ==============================
// BOOKING
// ==============================

model Booking {
  id String @id @default(uuid())

  tenantId   String
  ownerId    String
  propertyId String
  roomId     String?

  startDate DateTime
  endDate   DateTime?

  monthlyRent    Decimal @db.Decimal(12, 2)
  securityDeposit Decimal? @db.Decimal(12, 2)

  status BookingStatus @default(PENDING)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tenant User @relation("BookingTenant", fields: [tenantId], references: [id], onDelete: Cascade)
  owner  User @relation("BookingOwner", fields: [ownerId], references: [id], onDelete: Cascade)

  property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  room     Room?    @relation(fields: [roomId], references: [id], onDelete: SetNull)

  payments Payment[]

  @@index([tenantId])
  @@index([ownerId])
  @@index([propertyId])
  @@index([status])
  @@map("bookings")
}

// ==============================
// PAYMENT
// ==============================

model Payment {
  id        String @id @default(uuid())
  bookingId String
  userId    String

  amount        Decimal @db.Decimal(12, 2)
  paymentType   PaymentType
  transactionId String? @unique

  status PaymentStatus @default(PENDING)

  paidAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([bookingId])
  @@index([userId])
  @@index([status])
  @@map("payments")
}

// ==============================
// REVIEW
// ==============================

model Review {
  id         String @id @default(uuid())
  reviewerId String
  propertyId String
  ownerId    String?

  rating Int
  comment String?

  cleanliness       Int?
  locationRating    Int?
  ownerCommunication Int?
  facilities        Int?

  status ReviewStatus @default(ACTIVE)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  reviewer User @relation("Reviewer", fields: [reviewerId], references: [id], onDelete: Cascade)

  property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  owner User? @relation("OwnerReview", fields: [ownerId], references: [id], onDelete: SetNull)

  @@index([propertyId])
  @@index([reviewerId])
  @@index([ownerId])
  @@map("reviews")
}

// ==============================
// REPORT
// ==============================

model Report {
  id String @id @default(uuid())

  reporterId      String
  reportedUserId  String?
  propertyId      String?
  roommateListingId String?

  reason      ReportReason
  description String?

  status ReportStatus @default(PENDING)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  reporter User @relation("Reporter", fields: [reporterId], references: [id], onDelete: Cascade)

  reportedUser User? @relation("ReportedUser", fields: [reportedUserId], references: [id], onDelete: SetNull)

  property Property? @relation(fields: [propertyId], references: [id], onDelete: SetNull)

  roommateListing RoommateListing? @relation(fields: [roommateListingId], references: [id], onDelete: SetNull)

  @@index([reporterId])
  @@index([reportedUserId])
  @@index([propertyId])
  @@index([roommateListingId])
  @@index([status])
  @@map("reports")
}

// ==============================
// NOTIFICATION
// ==============================

model Notification {
  id     String @id @default(uuid())
  userId String

  type    NotificationType
  title   String
  message String

  isRead Boolean @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([isRead])
  @@map("notifications")
}

// ==============================
// OTP
// ==============================

model Otp {
  id     String @id @default(uuid())
  userId String

  otp      String
  type     OtpType
  expiresAt DateTime
  verified  Boolean @default(false)

  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([otp])
  @@index([expiresAt])
  @@map("otps")
}

// ==============================
// CHAT MESSAGE
// ==============================

model Message {
  id String @id @default(uuid())

  senderId   String
  receiverId String

  messageType MessageType @default(TEXT)
  content     String

  status MessageStatus @default(SENT)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sender User @relation("MessageSender", fields: [senderId], references: [id], onDelete: Cascade)

  receiver User @relation("MessageReceiver", fields: [receiverId], references: [id], onDelete: Cascade)

  @@index([senderId])
  @@index([receiverId])
  @@index([createdAt])
  @@map("messages")
}

// ==============================
// AUDIT LOG
// ==============================

model AuditLog {
  id     String @id @default(uuid())
  userId String?

  action AuditAction

  entity   String?
  entityId String?

  description String?

  ipAddress String?
  userAgent String?

  createdAt DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([entity])
  @@index([entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

The core models correspond to the source's conceptual models: User, Property, RoommateProfile, RoommateListing, RentalRequest, RoommateRequest, Booking, Payment, Review, and Report.

2. TypeScript Interfaces

I recommend creating:

src/
└── modules/
    ├── auth/
    │   └── auth.interface.ts
    ├── user/
    │   └── user.interface.ts
    ├── property/
    │   └── property.interface.ts
    ├── roommateProfile/
    │   └── roommateProfile.interface.ts
    ├── roommateListing/
    │   └── roommateListing.interface.ts
    ├── rentalRequest/
    │   └── rentalRequest.interface.ts
    ├── roommateRequest/
    │   └── roommateRequest.interface.ts
    ├── booking/
    │   └── booking.interface.ts
    ├── payment/
    │   └── payment.interface.ts
    ├── review/
    │   └── review.interface.ts
    ├── report/
    │   └── report.interface.ts
    └── notification/
        └── notification.interface.ts

You can use Prisma-generated enums instead of duplicating enum values.

3. src/modules/user/user.interface.ts
import {
  Role,
  UserStatus,
  AuthProvider,
} from "@prisma/client";

export interface IUserCreate {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  profileImage?: string;
  role?: Role;
  status?: UserStatus;
  authProvider?: AuthProvider;
  emailVerified?: boolean;
}

export interface IUserUpdate {
  name?: string;
  phone?: string;
  profileImage?: string;
  status?: UserStatus;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  role: Role;
  status: UserStatus;
  authProvider: AuthProvider;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
4. auth.interface.ts
export interface IRegister {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IVerifyEmail {
  email: string;
  otp: string;
}

export interface IResendOtp {
  email: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

The requirements specify email OTP verification, forgot-password OTP, change password, and access/refresh tokens.

5. property.interface.ts
import {
  FurnishedStatus,
  PropertyStatus,
  PropertyType,
} from "@prisma/client";

export interface IPropertyCreate {
  title: string;
  description: string;
  propertyType: PropertyType;

  address: string;
  city: string;
  area?: string;

  rent: number;
  securityDeposit?: number;

  bedrooms: number;
  bathrooms: number;
  availableRooms?: number;

  furnished: FurnishedStatus;

  availableFrom: Date;

  amenities: string[];
  images: string[];

  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface IPropertyUpdate {
  title?: string;
  description?: string;
  propertyType?: PropertyType;

  address?: string;
  city?: string;
  area?: string;

  rent?: number;
  securityDeposit?: number;

  bedrooms?: number;
  bathrooms?: number;
  availableRooms?: number;

  furnished?: FurnishedStatus;

  availableFrom?: Date;

  amenities?: string[];
  images?: string[];

  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;

  status?: PropertyStatus;
}

export interface IPropertyQuery {
  searchTerm?: string;
  city?: string;
  area?: string;

  minRent?: number;
  maxRent?: number;

  propertyType?: PropertyType;
  furnished?: FurnishedStatus;

  page?: number;
  limit?: number;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

The source requires property title, description, type, address, city, area, rent, deposit, bedrooms, bathrooms, available rooms, furnished state, available date, amenities, images and contact information.

6. room.interface.ts
import {
  FurnishedStatus,
  RoomType,
} from "@prisma/client";

export interface IRoomCreate {
  propertyId: string;

  name: string;
  roomNumber?: string;

  roomType: RoomType;

  rent: number;
  securityDeposit?: number;

  capacity?: number;
  availableBeds?: number;

  furnished?: FurnishedStatus;

  amenities: string[];
  images: string[];

  isAvailable?: boolean;
}

export interface IRoomUpdate {
  name?: string;
  roomNumber?: string;
  roomType?: RoomType;

  rent?: number;
  securityDeposit?: number;

  capacity?: number;
  availableBeds?: number;

  furnished?: FurnishedStatus;

  amenities?: string[];
  images?: string[];

  isAvailable?: boolean;
}

Note: The original requirements mention roomId and admin room management but do not define a separate conceptual Room model. Therefore Room above is an implementation extension, not a direct source model.

7. roommateProfile.interface.ts
import {
  FoodPreference,
  Gender,
  Lifestyle,
  RoomType,
  UserStatus,
} from "@prisma/client";

export interface IRoommateProfileCreate {
  name?: string;
  age?: number;
  gender?: Gender;

  occupation?: string;
  universityCompany?: string;

  location?: string;

  budgetMin?: number;
  budgetMax?: number;

  preferredLocation?: string;

  moveInDate?: Date;

  roomType?: RoomType;

  smoking?: boolean;
  pets?: boolean;

  foodPreference?: FoodPreference;

  lifestyle?: Lifestyle;

  about?: string;

  profileImage?: string;
}

export interface IRoommateProfileUpdate {
  name?: string;
  age?: number;
  gender?: Gender;

  occupation?: string;
  universityCompany?: string;

  location?: string;

  budgetMin?: number;
  budgetMax?: number;

  preferredLocation?: string;

  moveInDate?: Date;

  roomType?: RoomType;

  smoking?: boolean;
  pets?: boolean;

  foodPreference?: FoodPreference;

  lifestyle?: Lifestyle;

  about?: string;

  profileImage?: string;

  status?: UserStatus;
}

The source explicitly includes age, gender, occupation, university/company, location, budget, preferred area, move-in date, room type, smoking, pets, food preference, lifestyle, about and profile image.

8. roommateListing.interface.ts
import {
  Gender,
  Lifestyle,
  RoomType,
  RoommateListingStatus,
} from "@prisma/client";

export interface IRoommateListingCreate {
  title: string;
  description: string;

  location: string;

  rent: number;

  availableFrom: Date;

  genderPreference?: Gender;

  ageMin?: number;
  ageMax?: number;

  occupationPreference?: string;

  lifestylePreference?: Lifestyle;

  roomType?: RoomType;

  amenities: string[];

  images: string[];
}

export interface IRoommateListingUpdate {
  title?: string;
  description?: string;

  location?: string;

  rent?: number;

  availableFrom?: Date;

  genderPreference?: Gender;

  ageMin?: number;
  ageMax?: number;

  occupationPreference?: string;

  lifestylePreference?: Lifestyle;

  roomType?: RoomType;

  amenities?: string[];

  images?: string[];

  status?: RoommateListingStatus;
}

export interface IRoommateListingQuery {
  searchTerm?: string;
  location?: string;

  minRent?: number;
  maxRent?: number;

  genderPreference?: Gender;
  roomType?: RoomType;
  lifestylePreference?: Lifestyle;

  page?: number;
  limit?: number;
}
9. rentalRequest.interface.ts
import { RentalRequestStatus } from "@prisma/client";

export interface IRentalRequestCreate {
  propertyId: string;
  roomId?: string;

  message?: string;

  moveInDate: Date;

  numberOfPeople?: number;
}

export interface IRentalRequestUpdate {
  message?: string;
  moveInDate?: Date;
  numberOfPeople?: number;
  status?: RentalRequestStatus;
}

export interface IRentalRequestAction {
  status:
    | RentalRequestStatus.APPROVED
    | RentalRequestStatus.REJECTED
    | RentalRequestStatus.CANCELLED;
}

The source requires tenant, property, message, move-in date, number of people and request status.

10. roommateRequest.interface.ts
import { RoommateRequestStatus } from "@prisma/client";

export interface IRoommateRequestCreate {
  receiverId: string;
  listingId: string;
  message?: string;
}

export interface IRoommateRequestUpdate {
  message?: string;
  status?: RoommateRequestStatus;
}

export interface IRoommateRequestAction {
  status:
    | RoommateRequestStatus.ACCEPTED
    | RoommateRequestStatus.REJECTED
    | RoommateRequestStatus.CANCELLED;
}
11. booking.interface.ts
import { BookingStatus } from "@prisma/client";

export interface IBookingCreate {
  tenantId: string;
  ownerId: string;

  propertyId: string;
  roomId?: string;

  startDate: Date;
  endDate?: Date;

  monthlyRent: number;
  securityDeposit?: number;
}

export interface IBookingUpdate {
  startDate?: Date;
  endDate?: Date;

  monthlyRent?: number;
  securityDeposit?: number;

  status?: BookingStatus;
}

export interface IBookingStatusUpdate {
  status:
    | BookingStatus.CONFIRMED
    | BookingStatus.ACTIVE
    | BookingStatus.COMPLETED
    | BookingStatus.CANCELLED;
}

The source defines booking around tenant, owner, property, room, start/end dates, monthly rent, security deposit and booking status.

12. payment.interface.ts
import {
  PaymentStatus,
  PaymentType,
} from "@prisma/client";

export interface IPaymentCreate {
  bookingId: string;

  amount: number;

  paymentType: PaymentType;

  transactionId?: string;
}

export interface IPaymentUpdate {
  transactionId?: string;
  status?: PaymentStatus;
  paidAt?: Date;
}

export interface IPaymentWebhook {
  transactionId: string;
  status: PaymentStatus;
  amount: number;
}

Payment types are based on the source's monthly rent, security deposit, booking fee and service fee requirements.

13. review.interface.ts
import { ReviewStatus } from "@prisma/client";

export interface IReviewCreate {
  propertyId: string;

  ownerId?: string;

  rating: number;

  comment?: string;

  cleanliness?: number;
  locationRating?: number;
  ownerCommunication?: number;
  facilities?: number;
}

export interface IReviewUpdate {
  rating?: number;

  comment?: string;

  cleanliness?: number;
  locationRating?: number;
  ownerCommunication?: number;
  facilities?: number;

  status?: ReviewStatus;
}

The requirements specify 1–5 rating and review dimensions such as cleanliness, location, owner communication and facilities.

14. report.interface.ts
import {
  ReportReason,
  ReportStatus,
} from "@prisma/client";

export interface IReportCreate {
  reportedUserId?: string;

  propertyId?: string;

  roommateListingId?: string;

  reason: ReportReason;

  description?: string;
}

export interface IReportUpdate {
  status?: ReportStatus;

  description?: string;
}

export interface IReportAction {
  status:
    | ReportStatus.UNDER_REVIEW
    | ReportStatus.RESOLVED
    | ReportStatus.REJECTED;
}

The source supports reports for fake properties, fake roommates, wrong information, scams, inappropriate content, harassment and duplicate listings.

15. notification.interface.ts
import { NotificationType } from "@prisma/client";

export interface INotificationCreate {
  userId: string;

  type: NotificationType;

  title: string;

  message: string;
}

export interface INotificationUpdate {
  isRead?: boolean;
}
16. message.interface.ts
import {
  MessageStatus,
  MessageType,
} from "@prisma/client";

export interface IMessageCreate {
  receiverId: string;

  messageType?: MessageType;

  content: string;
}

export interface IMessageUpdate {
  status?: MessageStatus;
}

The requirements describe tenant ↔ owner and user ↔ roommate messaging with sender, receiver, message, timestamp and read status, with Socket.IO as a possible implementation.

17. otp.interface.ts
import { OtpType } from "@prisma/client";

export interface IOtpCreate {
  userId: string;

  otp: string;

  type: OtpType;

  expiresAt: Date;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}
18. admin.interface.ts
import {
  Role,
  UserStatus,
} from "@prisma/client";

export interface IAdminCreate {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role.ADMIN | Role.SUPER_ADMIN;
}

export interface IAdminUpdate {
  name?: string;
  phone?: string;
  status?: UserStatus;
}

export interface IUserRoleUpdate {
  role: Role;
}

export interface IUserStatusUpdate {
  status: UserStatus;
}

The source says Admin and Super Admin are not self-registered; Super Admin can create Admin/Super Admin accounts, while Admin cannot create them.

19. pagination.interface.ts

This one will be reusable for almost every module.

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IPaginationResult<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  data: T[];
}
20. query.interface.ts
export interface IQuery {
  searchTerm?: string;

  page?: number;
  limit?: number;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
21. Recommended Prisma folder

For a clean modular backend:

house-roommate-backend/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   │
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   └── db.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── role.ts
│   │   ├── validateRequest.ts
│   │   ├── globalErrorHandler.ts
│   │   └── notFound.ts
│   │
│   ├── types/
│   │   ├── pagination.interface.ts
│   │   └── query.interface.ts
│   │
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.interface.ts
│   │   │   └── auth.validation.ts
│   │   │
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.route.ts
│   │   │   ├── user.interface.ts
│   │   │   └── user.validation.ts
│   │   │
│   │   ├── property/
│   │   ├── room/
│   │   ├── roommateProfile/
│   │   ├── roommateListing/
│   │   ├── rentalRequest/
│   │   ├── roommateRequest/
│   │   ├── booking/
│   │   ├── payment/
│   │   ├── review/
│   │   ├── report/
│   │   ├── notification/
│   │   ├── message/
│   │   └── admin/
│   │
│   └── utils/
│       ├── jwt.ts
│       ├── bcrypt.ts
│       ├── catchAsync.ts
│       ├── sendResponse.ts
│       └── sendEmail.ts
│
├── .env
├── package.json
└── tsconfig.json
22. Install Prisma
npm install prisma @prisma/client

For TypeScript:

npm install -D typescript ts-node-dev @types/node

Initialize:

npx prisma init

Then .env:

DATABASE_URL="postgresql://postgres:password@localhost:5432/house_roommate_db?schema=public"
23. Generate database

After putting the schema into prisma/schema.prisma:

npx prisma format

Then:

npx prisma migrate dev --name init

Then:

npx prisma generate

To view the database:

npx prisma studio
Main database relationship
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
       ▼                   ▼                    ▼
   Property         RoommateProfile      RoommateListing
       │                                        │
       │                                        │
       ├──────────────┐                         ▼
       │              │                  RoommateRequest
       ▼              ▼
 RentalRequest      Review
       │
       ▼
    Booking
       │
       ▼
    Payment

User
 │
 ├── Notification
 ├── Message
 ├── OTP
 ├── Report
 └── AuditLog

This covers the main system flow from the requirements: property search → rental request → owner approval → booking → payment, plus roommate profile → listing → roommate request → acceptance/matching.

One important correction

I would not put role: CUSTOMER/PROVIDER directly into property/roommate business logic everywhere. Keep the role for authorization:

SUPER_ADMIN → full system administration
ADMIN       → platform management
PROVIDER    → property/room owner operations
CUSTOMER    → tenant/house seeker/roommate seeker

Then ownership should always be determined through IDs such as:

property.ownerId
rentalRequest.tenantId
rentalRequest.ownerId
booking.tenantId
booking.ownerId
roommateListing.userId

This makes your authorization much easier to implement correctly.