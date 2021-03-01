export interface Project {
  projectId: string,
  title: string,
  subscriberId: string,
  status: string,
  inceptionDate: any,
  closureDate: any,
  activityCount: number,
  activities: any[],
  estimatedEffort?: number,
  estimatedCost?: number,
  totalEffort?: number,
  totalBillableAmount?: number,
  members?: any,
  createdBy: string,
  createdOn: any,
  updatedBy: string,
  updatedOn: any
}
