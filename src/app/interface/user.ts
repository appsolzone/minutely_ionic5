export interface User {
  uid: string,
  subscriberId: string,
  name: string,
  email: string,
  phoneNumber?: string,
  appRole: string,
  jobTitle: string,
  status: string,
  address?: string,
  picUrl?: string,
  lastUpdateTimeStamp: any,
  userCreationTimeStamp: any
}
