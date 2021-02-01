import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(
    public db: DatabaseService,
  ) { }

  getPlan(planName:string){
    let queryObj = planName ? [{field: 'planName',operator: '==', value: planName}] : [];
    return this.db.getAllDocumentsByQuery(this.db.allCollections.plans, queryObj);
  }
}
