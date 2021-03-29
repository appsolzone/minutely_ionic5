import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { TextsearchService } from '../textsearch/textsearch.service';

@Injectable({
  providedIn: 'root'
})
export class RiskService {
  risk = {
      riskTitle :'',
      riskOwner :{
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      riskInitiationDate :null,
      riskEntryDate : null,
      targetCompletionDate :null,
      actualCompletionDate: null,
      riskStatus: 'OPEN',
      lastUpdateDate:null,
      subscriberId: null,
      latestComment:{
        author:'',
        comment:'',
        date:null,
        picUrl:'',
        totalComment:0
      },
      riskInitiator :{
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      tags:[],
      riskProbability :'',
      riskImpact:'',
      riskMitigation:'',
      riskContingency:'',
      searchMap:{},
      ownerInitiatorUidList:[],
  }

constructor(
    public db: DatabaseService,
    public searchMap: TextsearchService,
  ){
     // TBA
  }

  // Read
  getRisksOnce(queryObj:any[], textSearchObj: any = null, limit: number=null){
    return this.db.getAllDocumentsByQuery(this.db.allCollections.risk, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getRisks(queryObj:any[], textSearchObj: any = null, limit: any=null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.risk, queryObj, textSearchObj, limit);
  }
}
