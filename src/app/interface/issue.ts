export interface Issue {
    issueId?:string,
    issueTitle : string,
    issueOwner :any,
    issueInitiationDate : any,
    issueEntryDate : any,
    targetCompletionDate : any,
    actualCompletionDate: any,
    issueStatus: 'OPEN',
    lastUpdateDate: any,
    subscriberId:string,
    latestComment:any,
    issueInitiator :{
      name:string,
      uid:string,
      picUrl:any,
      subscriberId:string
    },
    tags:[],
    issueProbability :string,
    issueImpact:string,
    issueMitigation:string,
    issueContingency:string,
    titleSearchMap: any,
    ownerInitiatorUidList:Array<any>
}
