export interface Issue {
    // issueId?:string,
    // id?:string,
    issueTitle : string,
    issueOwner :{
      name:string,
      uid:string,
      picUrl:any,
      subscriberId:string,
      email:string
    },
    issueInitiationDate : any,
    // issueEntryDate : any,
    targetCompletionDate : any,
    actualCompletionDate: any,
    issueStatus: 'OPEN',
    lastUpdateDate: any,
    subscriberId:string,
    latestComment:{
      author:string,
      uid:string,
      picUrl:any,
      email:string,
      comment: string,
      date: any,
      totalComments: number
    },
    issueInitiator :{
      name:string,
      uid:string,
      picUrl:any,
      subscriberId:string,
      email:string
    },
    tags:[],
    issueDetails:string,
    searchMap: any,
    ownerInitiatorUidList:Array<any>
}
