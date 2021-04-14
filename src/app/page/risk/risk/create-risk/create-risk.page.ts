import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';
import { RiskService } from 'src/app/shared/risk/risk.service';
import { ComponentsService } from 'src/app/shared/components/components.service';


@Component({
  selector: 'app-create-risk',
  templateUrl: './create-risk.page.html',
  styleUrls: ['./create-risk.page.scss'],
})
@Autounsubscribe()
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
    private riskservice: RiskService,
    private common: ComponentsService,
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    // let riskStateData = history.state.data.risk;
    // console.log("riskDetails ngOnInit")
    // if(!riskStateData){
    //   console.log("ngOnInit")
    //   this.router.navigate(['risk']);
    // } else{
    //   if(riskStateData?.id!=this.risk?.id){
        let risk = {...this.riskservice.newRisk};
        this.getrisk({id:null,data:risk});
    //   }
    // }
  }

  ngOnDestroy(){}

  ionViewDidEnter(){
    // console.log("riskDetails ionViewDidEnter", history.state.data?.risk)
    // let riskStateData = history.state.data?.risk ? history.state.data.risk : this.risk;
    // if(!riskStateData){
    //   console.log("ionViewDidEnter")
    //   this.router.navigate(['risk']);
    // } else {
    //   if(riskStateData?.id!=this.risk?.id){
    //     this.getrisk(riskStateData);
    //   }
    // }
  }

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // Re populate the values as required
      this.sessionInfo = value;
      if(this.sessionInfo?.userProfile && this.risk?.data){
        const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
        console.log("userprofile values, ", uid, email, name, picUrl)
        this.risk.data.subscriberId =subscriberId;
        this.risk.data.riskInitiator ={uid, email, name, picUrl};
        this.risk.data.ownerInitiatorUidList.push(uid);
        this.refInformation.riskInitiator = {uid, email, name, picUrl};
      }
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

  sectionChanged(e)
  {
     this.showSection = e.detail.value;
   }

  // search implement
  getrisk(riskStateData){
    // this.risk = null;
    const data: any = riskStateData.data;
    const id: string = riskStateData.id;
    const riskInitiationDate = null; //moment().format('YYYY-MM-DD');
    const targetCompletionDate = null; //moment(data.targetCompletionDate).format('YYYY-MM-DD');
    const actualCompletionDate = null;
    // const overdue =  data.riskStatus != 'RESOLVED' && new Date(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
    // const overdueby = overdue=='overdue' ? moment(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')).fromNow() : '';
    this.risk = {id, data: {...data, riskInitiationDate, targetCompletionDate, actualCompletionDate } //,overdue,overdueby
                  };
    this.refInformation = {id, riskInitiationDate, targetCompletionDate,
                           riskStatus: data.riskStatus,
                           riskInitiator: {...data.riskInitiator},
                           riskOwner: {...data.riskOwner},
                           ownerInitiatorUidList: [...data.ownerInitiatorUidList],
                           riskTitle: data.riskTitle,
                           tags: [...data.tags]
                         };
    if(this.sessionInfo?.userProfile && this.risk?.data){
       const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
       console.log("userprofile values, ", uid, email, name, picUrl)
       this.risk.data.subscriberId =subscriberId;
       this.risk.data.riskInitiator ={uid, email, name, picUrl};
       this.risk.data.ownerInitiatorUidList.push(uid);
       this.refInformation.riskInitiator = {uid, email, name, picUrl};
    }
    console.log("risk details", this.risk);

  }

  // edit linkage callback
  publishLinkage(ev){
    this.alllinkages = ev.linkages;
    this.editedlinkages = ev.editedlinkages;
    console.log("edited data received", this.alllinkages, this.editedlinkages);
  }

  // saverisk
  async saveRisk(){
    const { riskStatus } = this.risk.data;
    let title = '';
    let body = '';
    let response: boolean = false;
    let buttons: any[] = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{response= false}  ,
                      resolve: false
                    }
                  ];
    let continueButtons = [...buttons,
                      {
                        text: 'Continue',
                        role: '',
                        cssClass: '',
                        handler: ()=>{response = true},
                        resolve: true
                      }
                    ];
    // If status is to CANCEL the risk, no need to check validation status
    let validation = riskStatus=='RESOLVED' ?
                     {status: true, title: 'resolved', body: 'resolved risk'}
                     :
                     this.riskservice.validateBasicInfo(this.risk, this.refInformation);

    if(!validation.status){
      await this.common.presentAlertConfirm(validation.title,validation.body, buttons);
    } else {
      title = 'Confirmation';
      body = "You are about to create a new risk. Are you sure that you want to continue to create the risk?";
      response = false;
      await this.common.presentAlertConfirm(title,body, continueButtons);
      console.log("response", response);
      if(response){
        continueButtons[0].text = "No";
        continueButtons[1].text = "Yes";
        // Now check if we have to propagate changes for the risk

        // If we are not cascading changes we should not check any thing else check the date again
        validation = riskStatus=='RESOLVED' ?
                         {status: true, title: 'resolved', body: 'resolved risk'}
                         :
                         this.riskservice.validateBasicInfo(this.risk, this.refInformation);
        if(riskStatus == 'RESOLVED' || validation.status){
          // Now run the process as required
          // this.navData.loader = true;
          // Let's cascade changes for the update
          // first clean existing entries
          // await this.transaction('clean', true);
          // this.navData.loader = true;
          // then save new changes
          await this.common.showLoader("Processing risk changes, please wait");
          let processriskstatus: any  = await this.riskservice.processRisk(this.risk, this.refInformation, this.alllinkages, this.sessionInfo);
          console.log("this.risk to be saved", this.risk, this.alllinkages, this.editedlinkages, this.refInformation, processriskstatus);
          this.common.hideLoader();
          const {status, title, body } = processriskstatus;
          continueButtons[0].text = "Dismiss";
          continueButtons[1].text = "Continue";
          this.common.presentAlert(title, body, buttons);
          if(status=='success'){
            this.router.navigate(['risk']);
          }
        }
      }
    }
  }

}
