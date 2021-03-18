export interface Risk {
    riskId?:string,
    id?:string,
    riskTitle : string,
    riskOwner :any,
    riskInitiationDate : any,
    riskEntryDate : any,
    targetCompletionDate : any,
    actualCompletionDate: any,
    riskStatus: 'OPEN',
    lastUpdateDate: any,
    subscriberId:string,
    latestComment:{
      author:string,
      comment:string,
      date:any;
      picUrl:string,
      totalComment:number
    },
    riskInitiator :{
      name:string,
      uid:string,
      picUrl:any,
      subscriberId:string,
      email:string
    },
    tags:Array<any>,
    riskProbability :string,
    riskImpact:string,
    riskMitigation:string,
    riskContingency:string,
    titleSearchMap: any,
    ownerInitiatorUidList:Array<any>,
}
