import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';
import { IssueService } from 'src/app/shared/issue/issue.service';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.page.html',
  styleUrls: ['./issue-details.page.scss'],
})
@Autounsubscribe()
export class IssueDetailsPage implements OnInit {

  // observables
  sessionSubs$;
  issuesSubs$;
  public sessionInfo: any;
  public issue: any;
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
    private issueservice: IssueService,
    private common: ComponentsService,
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    let issueStateData = history.state.data.issue;
    console.log("issueDetails ngOnInit")
    if(!issueStateData){
      console.log("ngOnInit")
      this.router.navigate(['issue']);
    } else{
      if(issueStateData?.id!=this.issue?.id){
        this.getIssue(issueStateData);
      }
    }
  }

  ngOnDestroy(){}

  ionViewDidEnter(){
    console.log("issueDetails ionViewDidEnter", history.state.data?.issue)
    let issueStateData = history.state.data?.issue ? history.state.data.issue : this.issue;
    if(!issueStateData){
      console.log("ionViewDidEnter")
      this.router.navigate(['issue']);
    } else {
      if(issueStateData?.id!=this.issue?.id){
        this.getIssue(issueStateData);
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
  getIssue(issueStateData){
    // this.issue = null;
    this.issuesSubs$ = this.issueservice.getIssueById(issueStateData.id)
                          .subscribe(act=>{
                              const data: any = act.payload.data();
                              const id: string = act.payload.id;
                              const issueInitiationDate = new Date(data.issueInitiationDate?.seconds*1000);
                              const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
                              const actualCompletionDate = data.actualCompletionDate?.seconds ? new Date(data.actualCompletionDate?.seconds*1000) : null;
                              const overdue =  data.issueStatus != 'RESOLVED' && new Date(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
                              const overdueby = overdue=='overdue' ? moment(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')).fromNow() : '';
                              this.issue = {id, data: {...data, issueInitiationDate, targetCompletionDate, actualCompletionDate },overdue,overdueby};

                              console.log("issue details", this.issue);
                          });

  }
  // edit linkage callback
  publishLinkage(ev){
    this.alllinkages = ev.linkages;
    this.editedlinkages = ev.editedlinkages;
    console.log("edited data received", this.alllinkages, this.editedlinkages);
  }

  // editIssue
  editIssue(){
    this.router.navigate(['issue/issue-details-edit'],{state: {data:{issue: this.issue}}});
  }
  // share minutes
  async sendIssueDetails(){
    let response: any = {} //await this.issueservice.shareIssueMinutes(this.issue, this.alllinkages);
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

}
