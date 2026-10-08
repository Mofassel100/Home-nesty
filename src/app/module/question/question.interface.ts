import { PropertyStatus, ProviderStatus, UserStatus } from "../../../generated/prisma/enums";

export interface ICreateQuestion {  
  title: string;
  description: string;
 
}

export interface IUpdateQuestion {
  title?: string;
  description?: string;
  status: UserStatus
   
}