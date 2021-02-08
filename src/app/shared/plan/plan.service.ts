import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ComponentsService } from '../components/components.service';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  choosePlan = new BehaviorSubject<any>(null);

  constructor(
    public db: DatabaseService,
    private componentService:ComponentsService,
    private router:Router
  ) { }

  getPlan(planName:string){
    let queryObj = planName ? [{field: 'planName',operator: '==', value: planName}] : [];
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.plans, queryObj);
  }

  getAllPlans(){
    return this.db.getAllDocuments(this.db.allCollections.plans);
  }

}
