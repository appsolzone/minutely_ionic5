export interface Activity {
  project: string,
  activityId: string,
  name: string,
  rate: number,
  locationStart: any,
  locationComplete: any,
  uid: string,
  status: string,
  subscriberId: string,
  startTime: any,
  endTime: any,
  user: {
    uid: string,
    name: string,
    picUrl: string,
    email: string
  }
}
