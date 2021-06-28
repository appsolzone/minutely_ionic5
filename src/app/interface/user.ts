export interface User {
  uid: string;
  subscriberId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  jobTitle: string;
  status: string;
  address?: string;
  picUrl?: string;
  fcm?: string;
  lastUpdateTimeStamp: any;
  userCreationTimeStamp: any;
}
