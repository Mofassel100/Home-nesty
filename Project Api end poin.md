House & Roommate API — 3-Day Completion Plan
0. Recommended API Structure

Use:

/api/v1/auth
/api/v1/users
/api/v1/properties
/api/v1/rooms
/api/v1/roommates
/api/v1/rental-requests
/api/v1/roommate-requests
/api/v1/bookings
/api/v1/payments
/api/v1/reviews
/api/v1/reports
/api/v1/messages
/api/v1/admin

Suggested backend structure:

src/
├── app.ts
├── server.ts
│
├── config/
│   ├── env.ts
│   └── db.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.route.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.validation.ts
│   │   └── auth.interface.ts
│   │
│   ├── user/
│   ├── property/
│   ├── room/
│   ├── roommate/
│   ├── rentalRequest/
│   ├── roommateRequest/
│   ├── booking/
│   ├── payment/
│   ├── review/
│   ├── report/
│   └── message/
│
├── middlewares/
│   ├── auth.ts
│   ├── validateRequest.ts
│   ├── globalErrorHandler.ts
│   └── notFound.ts
│
├── utils/
│   ├── jwt.ts
│   ├── bcrypt.ts
│   ├── sendEmail.ts
│   ├── sendResponse.ts
│   └── catchAsync.ts
│
└── routes/
    └── index.ts
DAY 1 — Authentication + User + Property
Step 1 — Authentication

Do these first because almost every other API needs authentication.

1. Register
POST /api/v1/auth/register

Body:

{
  "name": "John Doe",
  "email": "john@gmail.com",
  "phone": "01700000000",
  "password": "123456"
}

Flow:

Register
 ↓
Validate
 ↓
Check email
 ↓
Hash password
 ↓
Create user
 ↓
Generate OTP
 ↓
Send OTP
2. Verify Email OTP
POST /api/v1/auth/verify-email

Body:

{
  "email": "john@gmail.com",
  "otp": "123456"
}

Flow:

OTP valid
 ↓
emailVerified = true
 ↓
Account active
3. Login
POST /api/v1/auth/login

Body:

{
  "email": "john@gmail.com",
  "password": "123456"
}

Response:

accessToken
refreshToken
user
4. Refresh Token
POST /api/v1/auth/refresh-token
5. Logout
POST /api/v1/auth/logout
6. Forgot Password
POST /api/v1/auth/forgot-password

Body:

{
  "email": "john@gmail.com"
}
7. Verify Reset OTP
POST /api/v1/auth/verify-reset-otp
8. Reset Password
POST /api/v1/auth/reset-password

Body:

{
  "email": "john@gmail.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
9. Change Password
PATCH /api/v1/auth/change-password

Body:

{
  "currentPassword": "123456",
  "newPassword": "newPassword789"
}
Step 2 — User APIs
Get My Profile
GET /api/v1/users/me
Update My Profile
PATCH /api/v1/users/me

Body:

{
  "name": "John Doe",
  "phone": "01700000000",
  "address": "Mirpur, Dhaka"
}
Get User
GET /api/v1/users/:id
Get Users — Admin
GET /api/v1/users

Query:

?page=1&limit=10&search=john&status=ACTIVE
Block User
PATCH /api/v1/users/:id/block
Unblock User
PATCH /api/v1/users/:id/unblock
Step 3 — Property APIs

This is your most important module.

Create Property
POST /api/v1/properties

Body:

{
  "title": "Beautiful 2 Bedroom Apartment",
  "description": "Nice apartment near main road",
  "propertyType": "APARTMENT",
  "address": "Mirpur 10",
  "city": "Dhaka",
  "area": "Mirpur",
  "rent": 15000,
  "securityDeposit": 30000,
  "bedrooms": 2,
  "bathrooms": 2,
  "furnished": true,
  "availableFrom": "2026-10-01",
  "amenities": [
    "WiFi",
    "Parking",
    "Gas"
  ]
}

Status:

DRAFT

or directly:

PENDING

depending on your design.

Get All Published Properties
GET /api/v1/properties

Filters:

?page=1
&limit=10
&search=mirpur
&city=Dhaka
&propertyType=APARTMENT
&minRent=5000
&maxRent=20000
&bedrooms=2
&furnished=true
Get Single Property
GET /api/v1/properties/:id
Update Property
PATCH /api/v1/properties/:id

Only owner/admin can update.

Delete Property
DELETE /api/v1/properties/:id

Only owner/admin.

Get My Properties
GET /api/v1/properties/my-properties
Publish Property
PATCH /api/v1/properties/:id/publish
Admin Approve Property
PATCH /api/v1/properties/:id/approve
Admin Reject Property
PATCH /api/v1/properties/:id/reject

Body:

{
  "reason": "Property information is incomplete"
}
Admin Get Pending Properties
GET /api/v1/properties/admin/pending
DAY 1 END

By the end of Day 1 you should have:

✅ Register
✅ OTP verification
✅ Login
✅ Logout
✅ Refresh token
✅ Forgot password
✅ Reset password
✅ Change password
✅ User profile
✅ User management
✅ Create property
✅ Update property
✅ Delete property
✅ Property search/filter
✅ Property details
✅ Property approval
✅ Property rejection
DAY 2 — Rooms + Roommates + Requests + Booking
Step 4 — Room APIs

If rooms are separate from properties, create a Room module.

Create Room
POST /api/v1/rooms

Body:

{
  "propertyId": "property-id",
  "title": "Master Bedroom",
  "roomType": "PRIVATE",
  "rent": 8000,
  "availableFrom": "2026-10-01",
  "furnished": true,
  "amenities": [
    "Attached Bathroom",
    "WiFi"
  ]
}
Get Rooms
GET /api/v1/rooms

Filters:

?propertyId=
&minRent=
&maxRent=
&roomType=
&city=
Get Room
GET /api/v1/rooms/:id
Update Room
PATCH /api/v1/rooms/:id
Delete Room
DELETE /api/v1/rooms/:id
My Rooms
GET /api/v1/rooms/my-rooms
Change Room Availability
PATCH /api/v1/rooms/:id/availability

Body:

{
  "status": "AVAILABLE"
}
Step 5 — Roommate Profile APIs
Create Roommate Profile
POST /api/v1/roommates/profile

Body:

{
  "age": 25,
  "gender": "MALE",
  "occupation": "Software Developer",
  "budgetMin": 7000,
  "budgetMax": 12000,
  "preferredLocation": "Mirpur",
  "moveInDate": "2026-10-01",
  "roomType": "PRIVATE",
  "smoking": false,
  "pets": false,
  "lifestyle": "QUIET",
  "about": "Looking for a clean and friendly roommate."
}
Get My Roommate Profile
GET /api/v1/roommates/profile/me
Update Roommate Profile
PATCH /api/v1/roommates/profile
Delete Roommate Profile
DELETE /api/v1/roommates/profile
Search Roommates
GET /api/v1/roommates

Filters:

?location=Mirpur
&minBudget=5000
&maxBudget=12000
&gender=MALE
&occupation=STUDENT
Get Roommate Profile
GET /api/v1/roommates/:id
Step 6 — Roommate Listing
Create Listing
POST /api/v1/roommates/listings

Body:

{
  "title": "Looking for a roommate in Mirpur",
  "description": "One room available in a 2 bedroom apartment.",
  "location": "Mirpur 10",
  "rent": 9000,
  "availableFrom": "2026-10-01",
  "genderPreference": "MALE",
  "roomType": "PRIVATE",
  "lifestylePreference": "QUIET"
}
Get Listings
GET /api/v1/roommates/listings
Get Single Listing
GET /api/v1/roommates/listings/:id
Update Listing
PATCH /api/v1/roommates/listings/:id
Delete Listing
DELETE /api/v1/roommates/listings/:id
My Listings
GET /api/v1/roommates/my-listings
Close Listing
PATCH /api/v1/roommates/listings/:id/close
Step 7 — Rental Request APIs

Tenant requests a property/room.

Create Request
POST /api/v1/rental-requests

Body:

{
  "propertyId": "property-id",
  "roomId": "room-id",
  "moveInDate": "2026-10-01",
  "message": "I am interested in renting this room."
}
My Sent Requests
GET /api/v1/rental-requests/my
Requests Received by Owner
GET /api/v1/rental-requests/received
Get Single Request
GET /api/v1/rental-requests/:id
Approve Request
PATCH /api/v1/rental-requests/:id/approve
Reject Request
PATCH /api/v1/rental-requests/:id/reject
Cancel Request
PATCH /api/v1/rental-requests/:id/cancel
Step 8 — Roommate Request APIs
Send Request
POST /api/v1/roommate-requests

Body:

{
  "listingId": "listing-id",
  "message": "I am interested in sharing the apartment."
}
My Sent Requests
GET /api/v1/roommate-requests/sent
Received Requests
GET /api/v1/roommate-requests/received
Get Request
GET /api/v1/roommate-requests/:id
Accept
PATCH /api/v1/roommate-requests/:id/accept
Reject
PATCH /api/v1/roommate-requests/:id/reject
Cancel
PATCH /api/v1/roommate-requests/:id/cancel
Step 9 — Booking APIs
Create Booking

Usually create this after owner approval.

POST /api/v1/bookings

Body:

{
  "propertyId": "property-id",
  "roomId": "room-id",
  "startDate": "2026-10-01",
  "endDate": "2027-09-30"
}
My Bookings
GET /api/v1/bookings/my
Owner Bookings
GET /api/v1/bookings/owner
Booking Details
GET /api/v1/bookings/:id
Confirm Booking
PATCH /api/v1/bookings/:id/confirm
Cancel Booking
PATCH /api/v1/bookings/:id/cancel
Complete Booking
PATCH /api/v1/bookings/:id/complete
Step 10 — Payment APIs

If you are implementing payment.

Create Payment
POST /api/v1/payments
Payment Success
POST /api/v1/payments/success
Payment Failed
POST /api/v1/payments/fail
Payment History
GET /api/v1/payments/my
Payment Details
GET /api/v1/payments/:id
DAY 2 END

You should now have:

✅ Rooms
✅ Roommate profile
✅ Roommate search
✅ Roommate listings
✅ Rental requests
✅ Roommate requests
✅ Request approval/rejection
✅ Booking
✅ Booking lifecycle
✅ Payment
DAY 3 — Reviews + Reports + Chat + Admin + Testing
Step 11 — Review APIs
Create Property Review
POST /api/v1/reviews

Body:

{
  "propertyId": "property-id",
  "rating": 5,
  "comment": "Very good apartment and friendly owner."
}
Get Property Reviews
GET /api/v1/reviews/property/:propertyId
Update Review
PATCH /api/v1/reviews/:id
Delete Review
DELETE /api/v1/reviews/:id
Step 12 — Report APIs
Create Report
POST /api/v1/reports

Body:

{
  "propertyId": "property-id",
  "reason": "FAKE_LISTING",
  "description": "The property information appears to be fake."
}
My Reports
GET /api/v1/reports/my
Admin — All Reports
GET /api/v1/reports
Report Details
GET /api/v1/reports/:id
Update Report
PATCH /api/v1/reports/:id

Body:

{
  "status": "RESOLVED"
}
Step 13 — Chat APIs

For Socket.IO, you can keep REST APIs for conversation history.

Create/Get Conversation
POST /api/v1/conversations

Body:

{
  "receiverId": "user-id"
}
My Conversations
GET /api/v1/conversations
Conversation Details
GET /api/v1/conversations/:id
Send Message
POST /api/v1/messages

Body:

{
  "conversationId": "conversation-id",
  "message": "Is the room still available?"
}
Get Messages
GET /api/v1/messages/:conversationId
Mark Messages Read
PATCH /api/v1/messages/:conversationId/read

Socket.IO events:

connection
joinRoom
sendMessage
receiveMessage
typing
stopTyping
messageRead
disconnect
Step 14 — Admin APIs
Dashboard
GET /api/v1/admin/dashboard

Response should include:

{
  "totalUsers": 100,
  "activeUsers": 90,
  "blockedUsers": 10,
  "totalProperties": 50,
  "pendingProperties": 5,
  "publishedProperties": 35,
  "rentedProperties": 10,
  "roommateListings": 20,
  "pendingReports": 3
}
All Users
GET /api/v1/admin/users
Block User
PATCH /api/v1/admin/users/:id/block
Unblock User
PATCH /api/v1/admin/users/:id/unblock
Pending Properties
GET /api/v1/admin/properties/pending
Approve Property
PATCH /api/v1/admin/properties/:id/approve
Reject Property
PATCH /api/v1/admin/properties/:id/reject
All Reports
GET /api/v1/admin/reports
Resolve Report
PATCH /api/v1/admin/reports/:id/resolve
Step 15 — Admin Creation

Super Admin:

POST /api/v1/admin/create-admin

Body:

{
  "name": "Admin User",
  "email": "admin@example.com",
  "phone": "01700000000"
}

Only Super Admin should access this endpoint.

Complete API Checklist
AUTH
POST   /auth/register
POST   /auth/verify-email
POST   /auth/login
POST   /auth/refresh-token
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/verify-reset-otp
POST   /auth/reset-password
PATCH  /auth/change-password
USER
GET    /users
GET    /users/me
GET    /users/:id
PATCH  /users/me
PATCH  /users/:id/block
PATCH  /users/:id/unblock
PROPERTY
POST   /properties
GET    /properties
GET    /properties/my-properties
GET    /properties/:id
PATCH  /properties/:id
DELETE /properties/:id
PATCH  /properties/:id/publish
PATCH  /properties/:id/approve
PATCH  /properties/:id/reject
GET    /properties/admin/pending
ROOM
POST   /rooms
GET    /rooms
GET    /rooms/my-rooms
GET    /rooms/:id
PATCH  /rooms/:id
DELETE /rooms/:id
PATCH  /rooms/:id/availability
ROOMMATE
POST   /roommates/profile
GET    /roommates/profile/me
PATCH  /roommates/profile
DELETE /roommates/profile

GET    /roommates
GET    /roommates/:id

POST   /roommates/listings
GET    /roommates/listings
GET    /roommates/listings/:id
GET    /roommates/my-listings
PATCH  /roommates/listings/:id
DELETE /roommates/listings/:id
PATCH  /roommates/listings/:id/close
RENTAL REQUEST
POST   /rental-requests
GET    /rental-requests/my
GET    /rental-requests/received
GET    /rental-requests/:id
PATCH  /rental-requests/:id/approve
PATCH  /rental-requests/:id/reject
PATCH  /rental-requests/:id/cancel
ROOMMATE REQUEST
POST   /roommate-requests
GET    /roommate-requests/sent
GET    /roommate-requests/received
GET    /roommate-requests/:id
PATCH  /roommate-requests/:id/accept
PATCH  /roommate-requests/:id/reject
PATCH  /roommate-requests/:id/cancel
BOOKING
POST   /bookings
GET    /bookings/my
GET    /bookings/owner
GET    /bookings/:id
PATCH  /bookings/:id/confirm
PATCH  /bookings/:id/cancel
PATCH  /bookings/:id/complete
PAYMENT
POST   /payments
POST   /payments/success
POST   /payments/fail
GET    /payments/my
GET    /payments/:id
REVIEW
POST   /reviews
GET    /reviews/property/:propertyId
PATCH  /reviews/:id
DELETE /reviews/:id
REPORT
POST   /reports
GET    /reports/my
GET    /reports
GET    /reports/:id
PATCH  /reports/:id
CHAT
POST   /conversations
GET    /conversations
GET    /conversations/:id

POST   /messages
GET    /messages/:conversationId
PATCH  /messages/:conversationId/read
ADMIN
GET    /admin/dashboard
GET    /admin/users
PATCH  /admin/users/:id/block
PATCH  /admin/users/:id/unblock

GET    /admin/properties/pending
PATCH  /admin/properties/:id/approve
PATCH  /admin/properties/:id/reject

GET    /admin/reports
PATCH  /admin/reports/:id/resolve

POST   /admin/create-admin
3-Day Development Order
DAY 1
09:00 - 10:00
Project setup + database

10:00 - 12:00
User model + Auth

12:00 - 01:00
OTP + Email

02:00 - 04:00
JWT + Auth middleware + roles

04:00 - 07:00
Property module

07:00 - 09:00
Property search/filter + Admin approval

Day 1 target: 30–40% complete

DAY 2
09:00 - 11:00
Room module

11:00 - 02:00
Roommate profile + listing

02:00 - 04:00
Rental requests

04:00 - 06:00
Roommate requests

06:00 - 08:00
Booking

08:00 - 10:00
Payment

Day 2 target: 75–80% complete

DAY 3
09:00 - 11:00
Reviews

11:00 - 01:00
Reports

02:00 - 04:00
Conversation + Messages

04:00 - 06:00
Admin dashboard

06:00 - 08:00
Authorization/security testing

08:00 - 10:00
Postman testing + Swagger + README

Day 3 target: 100% API completion

Important Development Rule

Don't build every endpoint independently. Build each module in this order:

1. Model
     ↓
2. Validation
     ↓
3. Service
     ↓
4. Controller
     ↓
5. Route
     ↓
6. Middleware/Authorization
     ↓
7. Postman Test

For example:

Property
   ↓
Property Model
   ↓
Property Validation
   ↓
Property Service
   ↓
Property Controller
   ↓
Property Route
   ↓
Auth + Role Middleware
   ↓
Postman

Then move to:

Room
Roommate
Rental Request
Booking
...

This is much faster than writing all controllers first.

Priority if time becomes short

If you cannot finish every optional feature in 3 days, make sure these core APIs work first:

1. Register/Login
2. OTP
3. User profile
4. Create Property
5. Property Search
6. Property Details
7. Update/Delete Property
8. Admin Property Approval
9. Create Room
10. Room Search
11. Roommate Profile
12. Roommate Search
13. Roommate Listing
14. Rental Request
15. Approve/Reject Request
16. Booking
17. Booking Status
18. Review
19. Report
20. Admin Dashboard

That gives you a complete MVP House & Roommate backend, while payment and real-time chat can be treated as additional modules if the 3-day deadline is strict.