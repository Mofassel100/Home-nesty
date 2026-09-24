Project Requirements — House & Roommate System
1. Overview

House & Roommate System connects people looking for a house, room, or roommate with landlords/property owners and roommates.

A user can search for available houses or rooms based on location, rent, room type, and other preferences. A property owner can publish house/room listings, manage availability, and receive booking or rental requests. A person looking for a roommate can create a roommate profile and find compatible roommates based on location, budget, lifestyle, gender preference, occupation, and other requirements.

Admins manage users, properties, roommate listings, reports, and platform activities.

This document describes what the system must do and the exact business rules. It is not the database schema or API design.

2. User Roles

Three main roles exist:

Super Admin
Admin
User

A User can use the platform as either:

Tenant / House Seeker
Property Owner / Landlord
Roommate Seeker

A user does not need a separate account for each type.

Role	How they join	How they log in
User	Registers directly with email/password or Google	Email/password or Google
Admin	Created by Super Admin	Email/password
Super Admin	Created by another Super Admin	Email/password
2.1 User Types

A registered User can:

Search for houses
Search for rooms
Search for roommates
Publish a property
Publish an available room
Create a roommate profile
Send rental/roommate requests
Receive requests
Manage their own listings
3. Who Can Manage Whom

Admin and Super Admin have similar day-to-day management powers.

Action	Admin	Super Admin
View users	✅	✅
Block/unblock users	✅	✅
Approve property listings	✅	✅
Reject property listings	✅	✅
Remove inappropriate listings	✅	✅
Manage roommate listings	✅	✅
View reported listings	✅	✅
Create Admin	❌	✅
Block/unblock Admin	❌	✅
Create Super Admin	❌	✅
Block/unblock Super Admin	❌	✅
Management Screens

The admin dashboard contains:

User Management
Property Management
Room Management
Roommate Management
Booking/Request Management
Report Management
Admin Management
4. Accounts and Authentication
4.1 Registration

Users can register with:

Name
Email
Phone
Password

Alternatively, users can register using Google.

After registration, the user gets the default role:

USER

Users can later create:

Property Owner Profile
Tenant Profile
Roommate Profile

Admin and Super Admin accounts cannot self-register.

4.2 Email OTP Verification

Users who register using email/password must verify their email using an OTP.

Flow:

Register
   ↓
OTP sent to email
   ↓
Verify OTP
   ↓
Account activated

Google registration does not require OTP because Google has already verified the email.

5. Login

Users can log in using:

Email + Password

or:

Google Login

Admin and Super Admin use:

Email + Password

Only active users can log in.

Blocked users cannot access the system.

6. Forgot Password / Reset Password

The system provides a two-step password reset process.

Step 1 — Forgot Password

User enters:

Email

The system sends an OTP.

Step 2 — Reset Password

User submits:

OTP
New Password
Confirm Password

After successful verification, the password is updated.

7. Change Password

A logged-in user can change their password by providing:

Current Password
New Password
Confirm New Password

The current password must be correct before the new password can be saved.

8. Tokens and Sessions

After successful login or registration, the system generates:

Access Token
Refresh Token

These can be stored securely using HTTP-only cookies.

9. Property / House Listing

Property owners can publish houses, apartments, rooms, or shared accommodation.

A property listing may contain:

Title
Description
Property Type
Address
City
Area
Rent
Security Deposit
Number of Bedrooms
Number of Bathrooms
Available Rooms
Furnished Status
Available From
Amenities
Images
Contact Information
Owner
Status
Property Types

Examples:

Apartment
House
Sublet
Room
Bachelor Room
Family Apartment
Shared Apartment
Hostel
10. Creating a Property Listing

A property owner creates a listing.

Required information:

Property title
Description
Location
Monthly rent
Property type
Number of rooms
Available date
Images
Amenities

The listing initially has:

DRAFT

After submission:

PENDING

An Admin/Super Admin can approve it.

After approval:

PUBLISHED

Only published listings are visible to normal users.

11. Property Listing Status

A property can have:

DRAFT
PENDING
PUBLISHED
RENTED
UNAVAILABLE
REJECTED

Example lifecycle:

DRAFT
   ↓
PENDING
   ↓
PUBLISHED
   ↓
RENTED

If an Admin rejects the property:

PENDING → REJECTED
12. Searching for Houses and Rooms

Users can search available properties using:

Location
Dhaka
Chattogram
Sylhet
Rajshahi
Khulna
Barishal
Rangpur
Mymensingh
Rent

Example:

৳5,000 - ৳15,000
Property Type
Apartment
House
Room
Sublet
Hostel
Shared Apartment
Other Filters
Furnished
Unfurnished
Parking
Wi-Fi
Attached Bathroom
Kitchen
Gas
Electricity

Users can also search by keywords.

13. Roommate Profile

Users looking for roommates can create a Roommate Profile.

The profile can contain:

Name
Age
Gender
Occupation
University/Company
Location
Budget
Preferred Area
Move-in Date
Preferred Room Type
Smoking Preference
Pet Preference
Food Preference
Lifestyle
About Me
Profile Image

Example:

Budget: ৳8,000 - ৳12,000

Preferred Location:
Mirpur, Dhaka

Occupation:
Software Developer

Move-in:
October 2026

Smoking:
No

Pets:
No
14. Roommate Listing

A user can publish a roommate requirement.

Example:

Looking for a male roommate for a 2-bedroom apartment in Mirpur. One room is available. Monthly rent is ৳10,000.

A roommate listing contains:

Title
Description
Location
Monthly Rent
Available From
Gender Preference
Age Preference
Occupation Preference
Lifestyle Preference
Room Type
Amenities
Images
Created By
Status
15. Roommate Listing Status

A roommate listing can have:

DRAFT
ACTIVE
PAUSED
MATCHED
CLOSED
REJECTED

Lifecycle:

DRAFT
   ↓
ACTIVE
   ↓
MATCHED
   ↓
CLOSED
16. Room / Property Request

A tenant can send a request to a property owner.

Example:

User
  ↓
Select Property
  ↓
Send Rental Request
  ↓
Owner receives request

The request contains:

User
Property
Message
Move-in Date
Number of People
Status
Created At

Status:

PENDING
APPROVED
REJECTED
CANCELLED
17. Rental Request Lifecycle

The rental request follows:

PENDING
   ↓
APPROVED
   ↓
RENTED

or:

PENDING
   ↓
REJECTED

The property owner can approve or reject a request.

Once approved, the property/room can be marked:

RENTED

or:

UNAVAILABLE
18. Roommate Request

A user can contact/request another user for a roommate arrangement.

Flow:

User A
  ↓
View Roommate Profile
  ↓
Send Request
  ↓
User B receives request
  ↓
Accept / Reject

Request status:

PENDING
ACCEPTED
REJECTED
CANCELLED

After both users agree:

ACCEPTED

The roommate listing can automatically become:

MATCHED
19. Roommate Matching

The system can help users find suitable roommates based on:

Location
Budget
Gender Preference
Age
Occupation
Move-in Date
Smoking Preference
Pet Preference
Lifestyle
Room Type

Example:

User Budget:
৳10,000

Roommate Budget:
৳8,000 - ৳12,000

Location:
Mirpur

Preferred Location:
Mirpur

Result:
Potential Match

The system should show matching profiles without automatically creating a rental agreement.

20. Property Booking / Rental

If the platform supports booking, the user can request a property.

Flow:

Find Property
    ↓
View Details
    ↓
Send Rental Request
    ↓
Owner Approves
    ↓
Booking Confirmed

A booking can contain:

Tenant
Owner
Property
Room
Start Date
End Date
Monthly Rent
Security Deposit
Status
21. Booking Status

Booking statuses:

PENDING
CONFIRMED
ACTIVE
COMPLETED
CANCELLED

Lifecycle:

PENDING
   ↓
CONFIRMED
   ↓
ACTIVE
   ↓
COMPLETED
22. Payment

If online payment is implemented, the tenant can pay:

Monthly Rent
Security Deposit
Booking Fee
Service Fee

Payment status:

PENDING
PAID
FAILED
REFUNDED

After successful payment:

Booking → CONFIRMED

The system can generate a payment receipt/invoice.

23. Cancellation and Refund

A tenant can cancel a rental request or booking according to the platform's cancellation rules.

Example business rule:

Cancellation Time	Result
Before owner approval	Full cancellation
After approval but before move-in	Cancellation according to policy
After move-in	Cancellation according to rental agreement

If payment is implemented, refund rules depend on the cancellation policy.

Example:

Eligible for refund
        ↓
Cancel booking
        ↓
Refund payment
24. Property Reviews and Ratings

After renting a property, a tenant can review the property.

Review fields:

Rating
Comment
Cleanliness
Location
Owner Communication
Facilities

Rating:

1 - 5 stars

A user cannot review a property they never rented.

25. Owner Reviews

The system can also allow tenants to review property owners.

Example:

Communication
Responsiveness
Accuracy of Listing
Professionalism

This helps future tenants understand previous rental experiences.

26. Reports

Users can report:

Fake property
Fake roommate profile
Wrong information
Scam
Inappropriate content
Harassment
Duplicate listing

Report contains:

Reporter
Reported User
Property/Listing
Reason
Description
Status
Created At

Report status:

PENDING
UNDER_REVIEW
RESOLVED
REJECTED

Admins can investigate and take appropriate action.

27. Notifications

The system can notify users about:

Property Owner
New rental request
Request accepted
Request cancelled
New message
Property approved/rejected
Tenant
Rental request accepted
Rental request rejected
Booking confirmation
Payment confirmation
Property status changed
New message
Roommate
New roommate request
Request accepted/rejected
Potential roommate match
28. Messaging / Chat

Users can communicate with:

Property owners
Potential roommates
Tenants

Example:

Tenant ↔ Property Owner

User A ↔ User B

Messages can contain:

Sender
Receiver
Message
Timestamp
Read Status

Real-time chat can be implemented using Socket.IO.

29. Admin Dashboard

Admin dashboard should show:

Total Users
Active Users
Blocked Users
Total Properties
Pending Properties
Published Properties
Rented Properties
Roommate Listings
Rental Requests
Pending Reports

Admin can manage:

Users
Properties
Rooms
Roommates
Bookings
Reports
Reviews
30. Welcome Emails

The system can send emails for important events.

Event	Recipient	Email
First registration	User	Welcome email
Property approved	Owner	Property approved
Property rejected	Owner	Rejection notification
Rental request received	Owner	New request
Rental request approved	Tenant	Request approved
Roommate request	User	New roommate request
Password reset	User	OTP
Booking confirmed	Tenant	Booking confirmation
31. Data Models — Conceptual

The database design is separate from these requirements.

User
User
- id
- name
- email
- password
- phone
- profileImage
- role
- status
- emailVerified
- createdAt
- updatedAt

Roles:

SUPER_ADMIN
ADMIN
USER
Property
Property
- id
- ownerId
- title
- description
- propertyType
- address
- city
- area
- rent
- securityDeposit
- bedrooms
- bathrooms
- availableRooms
- furnished
- availableFrom
- amenities
- images
- status
- createdAt
- updatedAt
Roommate Profile
RoommateProfile
- id
- userId
- age
- gender
- occupation
- budgetMin
- budgetMax
- preferredLocation
- moveInDate
- roomType
- smoking
- pets
- lifestyle
- about
- status
- createdAt
- updatedAt
Roommate Listing
RoommateListing
- id
- userId
- title
- description
- location
- rent
- availableFrom
- genderPreference
- roomType
- lifestylePreference
- amenities
- images
- status
- createdAt
- updatedAt
Rental Request
RentalRequest
- id
- tenantId
- ownerId
- propertyId
- roomId
- message
- moveInDate
- status
- createdAt
- updatedAt
Roommate Request
RoommateRequest
- id
- senderId
- receiverId
- listingId
- message
- status
- createdAt
- updatedAt
Booking
Booking
- id
- tenantId
- ownerId
- propertyId
- roomId
- startDate
- endDate
- monthlyRent
- securityDeposit
- status
- createdAt
- updatedAt
Payment
Payment
- id
- bookingId
- userId
- amount
- paymentType
- transactionId
- status
- paidAt
Review
Review
- id
- reviewerId
- propertyId
- ownerId
- rating
- comment
- createdAt
- updatedAt
Report
Report
- id
- reporterId
- reportedUserId
- propertyId
- roommateListingId
- reason
- description
- status
- createdAt
- updatedAt
32. Main System Flow
                    HOUSE & ROOMMATE SYSTEM
                              |
             +----------------+----------------+
             |                |                |
           USER             ADMIN          SUPER ADMIN
             |                |                |
      +------+-------+        |         Manage Everything
      |              |        |
   Tenant         Owner       |
      |              |        |
 Search House     Add Property
 Search Room      Manage Property
 Find Roommate    Receive Requests
      |              |
      +------+-------+
             |
       Rental Request
             |
       Owner Approval
             |
        Booking
             |
          Payment
             |
       Active Rental
Roommate Flow
Create Roommate Profile
          ↓
Create Roommate Listing
          ↓
Other User Finds Listing
          ↓
Send Roommate Request
          ↓
Accept / Reject
          ↓
Matched
