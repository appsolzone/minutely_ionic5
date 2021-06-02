import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { SessionService } from 'src/app/shared/session/session.service';
import { IssueService } from 'src/app/shared/issue/issue.service';
import { ComponentsService } from 'src/app/shared/components/components.service';


@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.page.html',
  styleUrls: ['./create-issue.page.scss'],
})
@Autounsubscribe()
export class CreateIssuePage implements OnInit {

  // observables
  sessionSubs$;
  issuesSubs$;
  public showSection: string ='BASICINFO';
  public sessionInfo: any;
  public issue: any;
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
    private issueservice: IssueService,
    private common: ComponentsService,
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    // let issueStateData = history.state.data.issue;
    // console.log("issueDetails ngOnInit")
    // if(!issueStateData){
    //   console.log("ngOnInit")
    //   this.router.navigate(['issue']);
    // } else{
    //   if(issueStateData?.id!=this.issue?.id){
        let issue = {...this.issueservice.newIssue,
                      tags:[],
                      ownerInitiatorUidList:[]
                    };
        this.getissue({id:null,data:issue});
    //   }
    // }
  }

  ngOnDestroy(){}

  ionViewDidEnter(){
    // console.log("issueDetails ionViewDidEnter", history.state.data?.issue)
    // let issueStateData = history.state.data?.issue ? history.state.data.issue : this.issue;
    // if(!issueStateData){
    //   console.log("ionViewDidEnter")
    //   this.router.navigate(['issue']);
    // } else {
    //   if(issueStateData?.id!=this.issue?.id){
    //     this.getissue(issueStateData);
    //   }
    // }
  }

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // Re populate the values as required
      this.sessionInfo = value;
      if(this.sessionInfo?.userProfile && this.issue?.data){
        const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
        console.log("userprofile values, ", uid, email, name, picUrl)
        this.issue.data.subscriberId =subscriberId;
        this.issue.data.issueInitiator ={uid, email, name, picUrl};
        this.issue.data.ownerInitiatorUidList.push(uid);
        this.refInformation.issueInitiator = {uid, email, name, picUrl};
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
  getissue(issueStateData){
    // this.issue = null;
    const data: any = issueStateData.data;
    const id: string = issueStateData.id;
    const issueInitiationDate = null; //moment().format('YYYY-MM-DD');
    const targetCompletionDate = null; //moment(data.targetCompletionDate).format('YYYY-MM-DD');
    const actualCompletionDate = null;
    // const overdue =  data.issueStatus != 'RESOLVED' && new Date(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
    // const overdueby = overdue=='overdue' ? moment(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')).fromNow() : '';
    this.issue = {id, data: {...data, issueInitiationDate, targetCompletionDate, actualCompletionDate } //,overdue,overdueby
                  };
    this.refInformation = {id, issueInitiationDate, targetCompletionDate,
                           issueStatus: data.issueStatus,
                           issueInitiator: {...data.issueInitiator},
                           issueOwner: {...data.issueOwner},
                           ownerInitiatorUidList: [...data.ownerInitiatorUidList],
                           issueTitle: data.issueTitle,
                           tags: [...data.tags]
                         };
    if(this.sessionInfo?.userProfile && this.issue?.data){
       const {uid, email, name, picUrl, subscriberId} = this.sessionInfo.userProfile;
       console.log("userprofile values, ", uid, email, name, picUrl)
       this.issue.data.subscriberId =subscriberId;
       this.issue.data.issueInitiator ={uid, email, name, picUrl};
       this.issue.data.ownerInitiatorUidList.push(uid);
       this.refInformation.issueInitiator = {uid, email, name, picUrl};
    }
    console.log("issue details", this.issue);

  }

  // edit linkage callback
  publishLinkage(ev){
    this.alllinkages = ev.linkages;
    this.editedlinkages = ev.editedlinkages;
    console.log("edited data received", this.alllinkages, this.editedlinkages);
  }

  // saveissue
  async saveIssue(){
    const { issueStatus } = this.issue.data;
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
    // If status is to CANCEL the issue, no need to check validation status
    let validation = issueStatus=='RESOLVED' ?
                     {status: true, title: 'resolved', body: 'resolved issue'}
                     :
                     this.issueservice.validateBasicInfo(this.issue, this.refInformation);

    if(!validation.status){
      await this.common.presentAlertConfirm(validation.title,validation.body, buttons);
    } else {
      title = 'Confirmation';
      body = "Are you sure that you want to continue to create the issue?";
      response = false;
      await this.common.presentAlertConfirm(title,body, continueButtons);
      console.log("response", response);
      if(response){
        continueButtons[0].text = "No";
        continueButtons[1].text = "Yes";
        // Now check if we have to propagate changes for the issue

        // If we are not cascading changes we should not check any thing else check the date again
        validation = issueStatus=='RESOLVED' ?
                         {status: true, title: 'resolved', body: 'resolved issue'}
                         :
                         this.issueservice.validateBasicInfo(this.issue, this.refInformation);
        if(issueStatus == 'RESOLVED' || validation.status){
          // Now run the process as required
          // this.navData.loader = true;
          // Let's cascade changes for the update
          // first clean existing entries
          // await this.transaction('clean', true);
          // this.navData.loader = true;
          // then save new changes
          await this.common.showLoader("Processing issue changes, please wait");
          let processissuestatus: any  = await this.issueservice.processIssue(this.issue, this.refInformation, this.alllinkages, this.sessionInfo);
          console.log("this.issue to be saved", this.issue, this.alllinkages, this.editedlinkages, this.refInformation, processissuestatus);
          this.common.hideLoader();
          const {status, title, body } = processissuestatus;
          continueButtons[0].text = "Dismiss";
          continueButtons[1].text = "Continue";
          this.common.presentAlert(title, body, buttons);
          if(status=='success'){
            this.router.navigate(['issue']);
          }
        }
      }
    }
  }

  gotoSection(action){
    switch(action){
      case 'back':
        if(this.showSection=='OWNER'){
          this.showSection = 'BASICINFO';
        } else {
          this.showSection = 'OWNER';
        }
        break;
      case 'forward':
        if(this.showSection=='BASICINFO'){
          this.showSection = 'OWNER';
        } else {
          this.showSection = 'NOTES';
        }
        break;
    }
  }

}
