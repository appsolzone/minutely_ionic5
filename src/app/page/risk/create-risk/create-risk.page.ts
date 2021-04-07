import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { RiskService } from 'src/app/shared/risk/risk.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-create-risk',
  templateUrl: './create-risk.page.html',
  styleUrls: ['./create-risk.page.scss'],
})
export class CreateRiskPage implements OnInit {

    // observables
  sessionSubs$;
  risksSubs$;
  public showSection: string ='BASICINFO';
  public sessionInfo: any;
  public risk: any;
  public refInformation: any;
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
  constructor(
    private router: Router,
    private session: SessionService,
    private riskService: RiskService,
    private common: ComponentsService,
  ) { 
        this.getSessionInfo();
  }

  ngOnInit() {
   let risk = {...this.riskService.newRisk};
   this.getRisk({id:null,data:risk});
  }

  sectionChanged(e)                  
  {
     this.showSection = e.detail.value;
   }

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // Re populate the values as required
      this.sessionInfo = value;
      if(this.sessionInfo?.userProfile && this.risk?.data){
        const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
        console.log("userprofile values, ", uid, email, name, picUrl)
        this.risk.data.subscriberId =subscriberId;
        this.risk.data.ownerId ={uid, email, name, picUrl};
        this.refInformation.ownerId = {uid, email, name, picUrl};
      }
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

    // search implement
  getRisk(riskStateData){
    // this.risk = null;
    const data: any = riskStateData.data;
    const id: string = riskStateData.id;
    const riskInitiationDate = null; //moment(data.riskInitiationDate).format('YYYY-MM-DDTHH:mm');
    const targetCompletionDate = null; //moment(data.targetCompletionDate).format('YYYY-MM-DDTHH:mm');
    // const weekdays = data.weekdays ? data.weekdays : [false,false,false,false,false,false,false];

    this.risk = {id, data: {...data, riskInitiationDate, targetCompletionDate
    }};

    this.refInformation = {id, riskInitiationDate, targetCompletionDate,
    status: data.riskStatus,
    riskOwner: {...data.riskOwner},
    // attendeeList: [...data.attendeeList],
    riskTitle: data.riskTitle,
    tags: [...data.tags],
    toCascadeChanges: true};
     if(this.sessionInfo?.userProfile && this.risk?.data){
       const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
       console.log("userprofile values, ", uid, email, name, picUrl)
       this.risk.data.subscriberId =subscriberId;
       this.risk.data.riskOwner ={uid, email, name, picUrl};
       this.refInformation.riskOwner = {uid, email, name, picUrl};
     }
    console.log("risk details", this.risk);

  }

  // saveRisk
  async saveRisk(){
    const { status } = this.risk.data;
    let { toCascadeChanges } = this.refInformation;
    let title = '';
    let body = '';
    let response: boolean = false;
    let buttons: any[] = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{response = false;},
                      resolve: false
                    }
                  ];
    let continueButtons = [...buttons,
                      {
                        text: 'Continue',
                        role: '',
                        cssClass: '',
                        handler: ()=>{response = true;},
                        resolve: true
                      }
                    ];
    // If status is to CANCEL the risk, no need to check validation status
    let validation = status=='RESOLVED' ?
                     {status: true, title: 'cancel', body: 'resolve risk'}
                     :
                     this.riskService.validateBasicInfo(this.risk, this.refInformation);

    if(!validation.status){
      await this.common.presentAlertConfirm(validation.title,validation.body, buttons);
      this.showSection = 'BASICINFO';
    } else {
      response = true;
      // if(attendeeList.length==0){
      //   title = 'Confirmation';
      //   body = "No attendee has been added/selected for the risk. Are you sure that you want to continue to create the risk without any attendee?"
      //   response = false;
      //   await this.common.presentAlertConfirm(title,body, continueButtons);
      // }
      if(response){
        // this.riskservice.processrisk(this.risk, this.refInformation, this.alllinkages, this.sessionInfo);
        let processRiskstatus: any = await this.riskService.processRisk(this.risk, this.refInformation, this.alllinkages, this.sessionInfo);
        console.log("this.risk to be saved", this.risk, this.alllinkages, this.refInformation, processRiskstatus);
        this.common.hideLoader();
        const {status, title, body } = processRiskstatus;
        this.common.presentAlert(title, body, buttons);
        if(status=='success'){
          this.router.navigate(['risk']);
        }
      } else {
        this.showSection = 'ATTENDEES';
      }
    }
  }
}
