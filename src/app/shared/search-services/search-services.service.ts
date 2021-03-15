import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { CrudService } from '../crud/crud.service';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class SearchServicesService {

  constructor(
    private _db:DatabaseService,
    private _crud:CrudService,
  ) { }

  fetchAllRisks(collection,queryObj,searchTextObj = null){
   console.log("this query object are :",queryObj);

   return this._crud.fetchAllServices(this._db.allCollections[collection],queryObj,searchTextObj).
   pipe(
    map((a:any[])=>{
        return a.map((b:any)=>{
         let id = b.payload.doc.id;
         let data = b.payload.doc.data();
         
          data.docId = id;
          data.targetCompletionDate = moment(data.targetCompletionDate.seconds*1000).format('ll');
          data.actualCompletionDate =  data.actualCompletionDate ? moment(data.actualCompletionDate.seconds*1000).format('ll') : moment(data.targetCompletionDate.seconds*1000).format('ll');
          data.riskInitiationDate = moment(data.riskInitiationDate.seconds*1000).format('ll');
          data.overdue =  data.riskStatus != 'RESOLVED' && new Date(data.targetCompletionDate.seconds*1000 + 23.9*3600000) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
         return {
            id: id,
            ...data
        };
       })
     })
   )
}
}
