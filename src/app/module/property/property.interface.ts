








// export enum PaymentStatus {
//   UNPAID = "UNPAID",
//   PAID = "PAID",
//   FAILED = "FAILED",
//   CANCELLED = "CANCELLED",
//   REFUNDED = "REFUNDED",
// }

export enum ScheduleStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  SUBLET = "SUBLET",
  ROOM = "ROOM",
  BACHELOR_ROOM = "BACHELOR_ROOM",
  FAMILY_APARTMENT = "FAMILY_APARTMENT",
  SHARED_APARTMENT = "SHARED_APARTMENT",
  HOSTEL = "HOSTEL",
}

export enum PropertyStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PUBLISHED = "PUBLISHED",
  RENTED = "RENTED",
  UNAVAILABLE = "UNAVAILABLE",
  REJECTED = "REJECTED",
}

export enum FurnishedStatus {
  FURNISHED = "FURNISHED",
  UNFURNISHED = "UNFURNISHED",
  SEMI_FURNISHED = "SEMI_FURNISHED",
}

export enum RoomType {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  SHARED = "SHARED",
  MASTER = "MASTER",
  PRIVATE = "PRIVATE",
  BACHELOR = "BACHELOR",
  FAMILY = "FAMILY",
}

export enum Lifestyle {
  QUIET = "QUIET",
  SOCIAL = "SOCIAL",
  BALANCED = "BALANCED",
}

export enum FoodPreference {
  VEG = "VEG",
  NON_VEG = "NON_VEG",
  BOTH = "BOTH",
  ANY = "ANY",
}

export enum RoommateListingStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  MATCHED = "MATCHED",
  CLOSED = "CLOSED",
  REJECTED = "REJECTED",
}

export enum RoommateRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentType {
  MONTHLY_RENT = "MONTHLY_RENT",
  SECURITY_DEPOSIT = "SECURITY_DEPOSIT",
  BOOKING_FEE = "BOOKING_FEE",
  SERVICE_FEE = "SERVICE_FEE",
}

export enum ReportReason {
  FAKE_PROPERTY = "FAKE_PROPERTY",
  FAKE_ROOMMATE = "FAKE_ROOMMATE",
  WRONG_INFORMATION = "WRONG_INFORMATION",
  SCAM = "SCAM",
  INAPPROPRIATE_CONTENT = "INAPPROPRIATE_CONTENT",
  HARASSMENT = "HARASSMENT",
  DUPLICATE_LISTING = "DUPLICATE_LISTING",
  OTHER = "OTHER",
}

export enum ReportStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export enum NotificationType {
  RENTAL_REQUEST = "RENTAL_REQUEST",
  RENTAL_APPROVED = "RENTAL_APPROVED",
  RENTAL_REJECTED = "RENTAL_REJECTED",
  RENTAL_CANCELLED = "RENTAL_CANCELLED",

  ROOMMATE_REQUEST = "ROOMMATE_REQUEST",
  ROOMMATE_ACCEPTED = "ROOMMATE_ACCEPTED",
  ROOMMATE_REJECTED = "ROOMMATE_REJECTED",
  ROOMMATE_MATCH = "ROOMMATE_MATCH",

  PROPERTY_APPROVED = "PROPERTY_APPROVED",
  PROPERTY_REJECTED = "PROPERTY_REJECTED",
  PROPERTY_STATUS_CHANGED = "PROPERTY_STATUS_CHANGED",

  BOOKING_CONFIRMED = "BOOKING_CONFIRMED",
  PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED",

  NEW_MESSAGE = "NEW_MESSAGE",
  GENERAL = "GENERAL",
}

export enum OtpType {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
}

export enum MessageStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
}

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  BLOCK = "BLOCK",
  UNBLOCK = "UNBLOCK",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  PAYMENT = "PAYMENT",
  OTHER = "OTHER",
}
export interface IProperty {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  area?: string | null;
  rent: number;
  securityDeposit?: number | null;
  bedrooms: number;
  bathrooms: number;
  availableRooms: number;
  furnished: FurnishedStatus;
    imageUrl ?:          string       
  imagePublicId?:      string       
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;

  status: PropertyStatus;

}