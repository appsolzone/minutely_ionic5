import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
// import { Activity } from '../../interface/activity';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    public db: DatabaseService,
  ) { }

  getActivities(queryObj:any[], textSearchObj: any = null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.activities, queryObj, textSearchObj);
  }
  getActivitiesSummary(queryObj:any[], textSearchObj: any = null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.userSummary, queryObj, textSearchObj);
  }

}
