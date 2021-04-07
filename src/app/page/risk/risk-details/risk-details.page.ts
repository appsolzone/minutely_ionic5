import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { RiskService } from 'src/app/shared/risk/risk.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.page.html',
  styleUrls: ['./risk-details.page.scss'],
})

@Autounsubscribe()
export class RiskDetailsPage implements OnInit,OnDestroy {
  // observables
  sessionSubs$;
  risksSubs$;
  public sessionInfo: any;
  public risk: any;


  public alllinkages: any = {
                            meetings: [],
                            tasks: [],
                            issues: [],
                            risks: []
                          };

  
  constructor(
    private router:Router,
    private session:SessionService,
    private riskService: RiskService,
    private common: ComponentsService,
    ) {
        this.getSessionInfo();
     }

  ngOnInit() {
    let riskStateData = history.state.data.risk;
    console.log("riskDetails ngOnInit")
    if(!riskStateData){
      console.log("ngOnInit")
      this.router.navigate(['risk']);
    } else{
      if(riskStateData?.id!=this.risk?.id){
        this.getRisk(riskStateData);
      }
    }
  }
  ngOnDestroy(){}

  getSessionInfo(){
   this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // Re populate the values as required
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

  ionViewDidEnter(){
    console.log("riskDetails ionViewDidEnter", history.state.data?.risk)
    let riskStateData = history.state.data?.risk ? history.state.data.risk : this.risk;
    if(!riskStateData){
      console.log("ionViewDidEnter")
      this.router.navigate(['risk']);
    } else {
      if(riskStateData?.id!=this.risk?.id){
        this.getRisk(riskStateData);
      }
    }
  }

   // search implement
  getRisk(riskStateData){
    // this.risk = null;
    this.risksSubs$ = this.riskService.getRiskById(riskStateData.id)
                          .subscribe(act=>{
                              const data: any = act.payload.data();
                              const id: string = act.payload.id;
                              const riskInitiationDate = new Date(data.riskInitiationDate?.seconds*1000);
                              const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
                              this.risk = {id, data: {...data, targetCompletionDate, riskInitiationDate }};

                              console.log("risk details", this.risk);
                          });

  }




  // goToCommentPage(risk){
  //  let passObj = {...risk,parentModule:'risk',navigateBack:'/risk/risk-details'};
  //  this.crud.detailsPagePasing$.next(passObj);
  //  this.router.navigate(['/risk/risk-details/comments']); 
  // }

    // editrisk
  editRisk(){
    this.router.navigate(['risk/risk-details-edit'],{state: {data:{risk: this.risk}}});
  }
  // share Risk
  // async sendMinutes(){
  //   let response = await this.riskService.shareRiskMinutes(this.risk, this.alllinkages);
  //   let buttons = [
  //                   {
  //                     text: 'Dismiss',
  //                     role: 'cancel',
  //                     cssClass: '',
  //                     handler: ()=>{}
  //                   }
  //                 ];
  //   this.common.presentAlert(response.title, response.body, buttons);
  // }


}
