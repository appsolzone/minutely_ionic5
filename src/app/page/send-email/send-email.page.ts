import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { ComponentsService } from 'src/app/shared/components/components.service';
// import { IssueService } from 'src/app/shared/issue/issue.service';
// import { RiskService } from 'src/app/shared/risk/risk.service';
import { SessionService } from 'src/app/shared/session/session.service';
// import { TaskService } from 'src/app/shared/task/task.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.page.html',
  styleUrls: ['./send-email.page.scss'],
})
@Autounsubscribe()
export class SendEmailPage implements OnInit,OnDestroy {
  // observables
  sessionSubs$;

  public sessionInfo: any;
  public service: any;
  public allLinkages:any;
  public stateData:any;
  public returnPath:any;
  public parentsModule:any;
  public alreadySelectedUserList = []
  constructor(
    private router: Router,
    private session: SessionService,
    // private taskService:TaskService,
    // private issueService:IssueService,
    // private riskService:RiskService,
    private common:ComponentsService
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    this.stateData = history.state.data.service;
    this.allLinkages= history.state.data.linkages;
    this.parentsModule = history.state.data.parentsModule;
    this.returnPath = '/'+this.parentsModule;
    console.log("riskDetails ionViewDidEnter", history.state.data?.service,history.state.data.linkages,history.state.data.parentsModule)
    if(!this.stateData){
      console.log("ngOnInit")
      this.router.navigate(['profile']);
    }
    // else{
    //   if(stateData?.id!=this.service?.id){
    //     this.getRiskComments(riskStateData);
    //   }
    // }
  }

  ngOnDestroy(){}

  ionViewDidEnter(){
    console.log("riskDetails ionViewDidEnter", history.state.data?.service,history.state.data.linkages,history.state.data.parentsModule)
    this.stateData = history.state.data?.service ? history.state.data.service : this.service;
    this.allLinkages = history.state.data.linkages ? history.state.data.linkages : this.allLinkages;
    this.parentsModule = history.state.data.parentsModule ? history.state.data.parentsModule : this.returnPath;
    this.returnPath = '/'+this.parentsModule;
    if(!this.stateData){
      console.log("ionViewDidEnter")
      this.router.navigate(['profile']);
    }
    // else {
    //   if(riskStateData?.id!=this.risk?.id){
    //     this.getRiskComments(riskStateData);
    //   }
    // }
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

  async shareDetails(selectedMembers){
    console.log(selectedMembers);
    let response: any
    // if(this.parentsModule == 'task'){
    //  response = await this.taskService.shareTaskMinutes(this.stateData, this.allLinkages,selectedMembers);
    // }
    // else if(this.parentsModule == 'issue'){
    // response = await this.issueService.shareIssueMinutes(this.stateData, this.allLinkages,selectedMembers);
    // }else{
    // response = await this.riskService.shareRiskMinutes(this.stateData, this.allLinkages,selectedMembers);
    // }

    this.successMsgAndReturn(response);

  }

  successMsgAndReturn(response){
    console.log(response);
    let buttons = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{}
                    }
                  ];
    this.common.presentAlert(response.title, response.body, buttons);
    this.router.navigate([this.parentsModule+'/'+ this.parentsModule +'-details'])
  }
}
