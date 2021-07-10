import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { UserCommentService } from 'src/app/shared/user-comment/user-comment.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { SpeechService } from 'src/app/shared/speech/speech.service';

@Component({
  selector: 'app-issue-user-comments',
  templateUrl: './issue-user-comments.page.html',
  styleUrls: ['./issue-user-comments.page.scss'],
})
@Autounsubscribe()
export class IssueUserCommentsPage implements OnInit,OnDestroy {

  // observables
  sessionSubs$;
  issueComments$;

  public sessionInfo: any;
  public issue: any;
  public allComments:any;
  public postedComment:string ='';
  public commentObj;
  constructor(
    private router: Router,
    private session: SessionService,
    private commentServ:UserCommentService,
    private componentService:ComponentsService,
    private speech: SpeechService,
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    let issueStateData = history.state.data.issue;
    if(!issueStateData){
     // console.log("ngOnInit")
      this.router.navigate(['issue']);
    } else{
      if(issueStateData?.id!=this.issue?.id){
        this.getIssueComments(issueStateData);
      }
    }
  }

  ngOnDestroy(){}

  ionViewDidEnter(){
   // console.log("issueDetails ionViewDidEnter", history.state.data?.issue)
    let issueStateData = history.state.data?.issue ? history.state.data.issue : this.issue;
    if(!issueStateData){
     // console.log("ionViewDidEnter")
      this.router.navigate(['issue']);
    } else {
      if(issueStateData?.id!=this.issue?.id){
        this.getIssueComments(issueStateData);
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


  getIssueComments(issueStateData){
    this.issue = issueStateData;
    this.commentObj = {...this.commentServ.newComment};
    let allComments = [];
    this.allComments = [];
    this.issueComments$ = this.commentServ.fetchAllComments('issue',issueStateData.id)
    .subscribe(res=>{
        this.allComments = [];
        let comments = res.map((a: any) => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        const date = new Date(data.date?.seconds*1000);
        // let obj = {id, data: {...data}}
        // allComments.push(obj);
        return {...data,date};
      });
      this.allComments = comments.sort((a:any,b:any)=>b.date-a.date);
      console.log(this.allComments);
    });
  }
  async addComment(){
    await this.componentService.showLoader('Adding your comment, please wait...');
    let commentObj = {...this.commentServ.newComment};
    commentObj.author = this.sessionInfo.userProfile.name;
    commentObj.comment = this.postedComment;
    commentObj.picUrl = this.sessionInfo.userProfile.picUrl;
    commentObj.uid = this.sessionInfo.userProfile.uid;
    let servicedoc = {collectionName:'issue',id:this.issue.id,members:[{...this.issue.issueOwner},{...this.issue.issueInitiator}]};
    this.commentServ.addComment(commentObj,servicedoc,this.sessionInfo)
    .then((res)=>{
    //  console.log("comment add resposnse",res);
      this.postedComment = '';
      this.componentService.hideLoader();
      this.componentService.presentToaster('Your comment added successfully!!');
    })
    .catch(error=>{
      this.componentService.hideLoader();
      console.log(error)
    });
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

  async startSpeech(type){
    let res = await this.speech.startListening('What would you like to add as ' + type);
    if(res?.text){
      this.postedComment += (' ' + res.text);
    }
  }
}
