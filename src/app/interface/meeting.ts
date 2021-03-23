export interface Meeting {
  id?:string,
  meetingTitle:string,
  meetingStart:any,
  meetingEnd:any,
  status:string,
  subscriberId:string,
  ownerId: {
    name:any,
    uid:string,
    subscriberId:string,
    picUrl:string,
  },
  meetingPlace: any,
  callList:string,
  tags:[],

  attendeeList?:any,
  attendeeUidList?:any,
  notes?:string,
  agendas?:string,
  searchMap?:any,

  eventSequenceId?: number,
  isOccurence?:boolean,
  occurenceType?:any,
  noOfOccurence?:number,
  weekdays?:any,
}
