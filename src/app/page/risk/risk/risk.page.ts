import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { Risk } from 'src/app/interface/risk';
import { User } from 'src/app/interface/user';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { DatabaseService } from 'src/app/shared/database/database.service';
import { SearchText } from 'src/app/shared/empty-screen-text/empty-screen-text';
import { KpiService } from 'src/app/shared/kpi/kpi.service';
import { SessionService } from 'src/app/shared/session/session.service';


@Component({
  selector: 'app-risk',
  templateUrl: './risk.page.html',
  styleUrls: ['./risk.page.scss'],
})
@Autounsubscribe()
export class RiskPage implements OnInit,OnDestroy {
  // observables
  sessionSubs$;
  public sessionInfo: any;

  constructor(
    private router:Router,
    private crud:CrudService,
    private session:SessionService,
    private kpi:KpiService,
  ) { }

  ngOnInit() {
    this.getSessionInfo();
  }

  ngOnDestroy(){}

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      console.log("testing :",value?.userProfile?true:false);
      if(this.sessionInfo?.uid != value?.uid){
        // TBA
      }
      if(value?.userProfile && this.sessionInfo?.userProfile?.subscriberId != value?.userProfile?.subscriberId){
        this.kpi.initialiseKpi(value);
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
     });
  }

  naviageteAddPage(){
   let actions = this.crud.crud_action; 
   actions = {
     service:'Risk',
     type:'create',
     parentModule:'risk',
     header:'Create new risk',
     object:this.crud.passingObj
   } 
   this.crud.crud_action$.next(actions);
   this.router.navigate(['/risk/initiate']);
  }
}
