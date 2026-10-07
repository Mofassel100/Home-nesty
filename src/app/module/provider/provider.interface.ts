import { PropertyStatus, ProviderStatus } from "../../../generated/prisma/enums";

export interface ICreateProvider {
      user: {
        name: string;
        email: string;
        password:string;
    };
    provider:{
  businessName?: string;
  phone?: string;
  address?: string;
  city?: string;
  nidNumber?: string;
  tradeLicense?: string;
  experience?: number;
  description?: string;
  nidDocument?: string;
  tradeLicenseDoc?: string;
  profileImage?: string;
}}
// import { DoctorVerificationStatus } from "../../../generated/prisma/enums";
// import { ProviderAvgOrderByAggregateInput } from "../../../generated/prisma/models";

// export interface IApplyAsDoctorPayload {
//     user: {
//         name: string;
//         email: string;
//     };
//     doctor: {
//         address?: string;
//         specialization: string;
//         licenseNumber: string;
//         qualifications: string;
//         experienceYears: number;
//         bio?: string;
//         consultationFee?: number;
//         contactNumber?: string;
//     };
// }


export interface IVerifyProviderEmailPayload {
    email: string;
    otp: string;
}


export interface IApproveProviderPayload {
    ProviderId: string;
    verificationStatus: ProviderStatus
    ;
    rejectionReason: string;
}

export interface IUpdateProviderProfilePayload {
    address?: string;
    bio?: string;
    consultationFee?: number;
    contactNumber?: string;
}