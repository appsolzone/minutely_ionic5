export interface Subscriber {
  subscriberId: string,
  companyName: string,
  country?: string,
  email: string,
  phoneNumber?: string,
  paypalId?: string,
  noOfFreeLicense: number,
  noOfUserAllowed: number,
  address?: string,
  picUrl?: string,
  tncVersion: number,
  subscriptionType: string,
  subscriptionStart: any,
  subscriptionEnd: any,
  lastUpdateTimeStamp: any,
  enrollmentDate: any
}
