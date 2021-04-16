import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';
import { RiskService } from 'src/app/shared/risk/risk.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { Platform, PopoverController } from '@ionic/angular';
import { SelectUsersComponent } from 'src/app/page/select-users/select-users.component';

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.page.html',
  styleUrls: ['./risk-details.page.scss'],
})
@Autounsubscribe()
export class RiskDetailsPage implements OnInit {

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
  public editedlinkages: any = {
                            meetings: [],
                            tasks: [],
                            issues: [],
                            risks: []
                          };
  public sendRiskDetailsMode:boolean = false;
  constructor(
    private router: Router,
    private session: SessionService,
    private riskservice: RiskService,
    private common: ComponentsService,
    public platform: Platform,
    public popoverController: PopoverController 
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

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // Re populate the values as required
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

  // search implement
  getRisk(riskStateData){
    // this.risk = null;
    this.risksSubs$ = this.riskservice.getRiskById(riskStateData.id)
                          .subscribe(act=>{
                              const data: any = act.payload.data();
                              const id: string = act.payload.id;
                              const riskInitiationDate = new Date(data.riskInitiationDate?.seconds*1000);
                              const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
                              const actualCompletionDate = data.actualCompletionDate?.seconds ? new Date(data.actualCompletionDate?.seconds*1000) : null;
                              const overdue =  data.riskStatus != 'RESOLVED' && new Date(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
                              const overdueby = overdue=='overdue' ? moment(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')).fromNow() : '';
                              this.risk = {id, data: {...data, riskInitiationDate, targetCompletionDate, actualCompletionDate },overdue,overdueby};

                              console.log("risk details", this.risk);
                          });

  }
  // edit linkage callback
  publishLinkage(ev){
    this.alllinkages = ev.linkages;
    this.editedlinkages = ev.editedlinkages;
    console.log("edited data received", this.alllinkages, this.editedlinkages);
  }

  // editRisk
  editRisk(){
    this.router.navigate(['risk/risk-details-edit'],{state: {data:{risk: this.risk}}});
  }

  sendTaskDetails(){
    if(this.platform.is('desktop') || this.platform.is('tablet')){
      this.sendRiskDetailsMode = !this.sendRiskDetailsMode;
      console.log(this.platform.is('desktop') || this.platform.is('tablet'));
      this.presentPopover(null);
    }else{
      this.router.navigate(['risk/send-email'],{state: {data:{service: this.risk,linkages:this.alllinkages,parentsModule:'risk'}}});
    }
  }

  // share task
  async shareTaskDetails(selectedMembers){
    console.log("in parent module",selectedMembers);
    let response: any = await this.riskservice.shareRiskMinutes(this.risk, this.alllinkages,selectedMembers);
    let buttons = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{} 
                    }
                  ];
    this.common.presentAlert(response.title, response.body, buttons);
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: SelectUsersComponent,
      cssClass: 'customPopover',
      event: ev,
      translucent: true,
      componentProps: { 
        sessionInfo:this.sessionInfo, alreadySelectedUserList: this.risk.data.taskOwner? [this.risk.data.riskOwner] : [],
        multiSelect:true,
        popoverMode:true,
       },
      // mode:'ios',
      backdropDismiss:false
    });
    
   await popover.present();

   popover.onDidDismiss().then((dataReturned) => {
      //console.log("returnded selected members:",dataReturned.data);
      if (dataReturned !== null) {
        this.shareTaskDetails(dataReturned.data);
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });
  }
}
