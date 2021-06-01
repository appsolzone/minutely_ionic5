import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';
import { IssueService } from 'src/app/shared/issue/issue.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { PopoverController, Platform } from '@ionic/angular';
import { SelectUsersComponent } from 'src/app/page/select-users/select-users.component';

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
  public sendIssueDetailsMode:boolean = false;
  constructor(
    private router: Router,
    private session: SessionService,
    private issueservice: IssueService,
    private common: ComponentsService,
    public popoverController: PopoverController,
    public platform: Platform,
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
  sendIssueDetails(ev: any){
    // if(this.platform.is('desktop') || this.platform.is('tablet')){
      this.sendIssueDetailsMode = !this.sendIssueDetailsMode;
      // console.log(this.platform.is('desktop') || this.platform.is('tablet'));
      // this.presentPopover(ev);
    // }else{
      this.router.navigate(['issue/send-email'],{state: {data:{service: this.issue,linkages:this.alllinkages,parentsModule:'issue'}}});
    // }
  }

  // share issue
  async shareIssueDetails(selectedMembers){
    console.log("in parent module",selectedMembers);
    if (selectedMembers != null){
      let response: any = await this.issueservice.shareIssueMinutes(this.issue, this.alllinkages,selectedMembers);
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
  async presentPopover(ev: any) {
    this.sendIssueDetailsMode = !this.sendIssueDetailsMode;
    const popover = await this.popoverController.create({
      component: SelectUsersComponent,
      cssClass: 'customPopover',
      event: ev,
      translucent: true,
      componentProps: {
        sessionInfo:this.sessionInfo, alreadySelectedUserList: this.issue.data.issueOwner? [this.issue.data.issueOwner] : [],
        buttonItem: { icon: 'paper-plane-outline', text: 'Send mail'},
        showAddUser: false,
        sectionHeader: { icon: 'people', text: 'Select Users to send email ' },
        multiSelect:true,
        popoverMode:true,
        showAddNonPermUser: true,
       },
      // mode:'ios',
      backdropDismiss:true //false
    });

   await popover.present();

   popover.onDidDismiss().then((dataReturned) => {
      console.log("returnded selected members:",dataReturned.data);
      if (dataReturned != null) {
        this.shareIssueDetails(dataReturned.data);
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });
  }

}
