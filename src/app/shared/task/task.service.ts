import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { TextsearchService } from '../textsearch/textsearch.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
   task = {
      taskTitle :'',
      taskOwner :{
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      taskInitiationDate :null,
      taskEntryDate : null,
      targetCompletionDate :null,
      actualCompletionDate: null,
      taskStatus: 'OPEN',
      lastUpdateDate:null,
      subscriberId: null,
      latestComment:{
        author:'',
        comment:'',
        date:null,
        picUrl:'',
        totalComment:0
      },
      taskInitiator :{
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      tags:[],
      taskDetails:'',
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
  getTasksOnce(queryObj:any[], textSearchObj: any = null, limit: number=null){
    return this.db.getAllDocumentsByQuery(this.db.allCollections.task, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getTasks(queryObj:any[], textSearchObj: any = null, limit: any=null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.task, queryObj, textSearchObj, limit);
  }
}
