import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DatabaseService } from 'src/app/shared/database/database.service';
import { TextsearchService } from 'src/app/shared/textsearch/textsearch.service';
import { Meeting } from 'src/app/interface/meeting';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  public newMeeting = {
      meetingTitle:'',
      meetingStart:null,
      meetingEnd:null,
      status:'OPEN',
      subscriberId:'',
      ownerId: {
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      meetingPlace: '',
      callList:'',
      tags:[],

      attendeeList:[],
      attendeeUidList:[],
      notes:'',
      agendas:'',
      searchMap:{},

      eventSequenceId: 0,
      isOccurence:false,
      occurenceType:'daily',
      noOfOccurence:1,
      weekdays:[false, false, false, false, false, false, false],
    }

  constructor(
    public db: DatabaseService,
    public searchMap: TextsearchService,
  ){
     // TBA
  }

  // Read
  getMeetingsOnce(queryObj:any[], textSearchObj: any = null, limit: number=null){
    return this.db.getAllDocumentsByQuery(this.db.allCollections.meeting, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getMeetings(queryObj:any[], textSearchObj: any = null, limit: any=null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.meeting, queryObj, textSearchObj, limit);
  }
  // Read and watch
  getMeetingById(id: string){
    return this.db.getDocumentSnapshotById(this.db.allCollections.meeting, id);
  }
}
