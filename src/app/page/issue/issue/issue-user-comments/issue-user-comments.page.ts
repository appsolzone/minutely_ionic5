import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { UserCommentService } from 'src/app/shared/user-comment/user-comment.service';

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
  public comment:string ='';
  public commentObj;
  constructor(
    private router: Router,
    private session: SessionService,
    private commentServ:UserCommentService
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

  backIssueDetails(issue){
    this.router.navigate(['issue/issue-details'],{state: {data:{issue: issue}}});

  }

  getIssueComments(issueStateData){
    this.issue = issueStateData;
    this.commentObj = {...this.commentServ.newComment};
    let allComments = [];
    this.allComments = [];
    this.issueComments$ = this.commentServ.fetchAllComments('issue',issueStateData.id)
    .subscribe(res=>{
        res.forEach((a: any) => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        data.date = new Date(data.date?.seconds*1000)
        let obj = {id, data: {...data}} 
        allComments.push(obj);
      });
      this.allComments = allComments.sort((a:any,b:any)=>a.data.date-a.data.date);
      console.log(this.allComments);
    });
  }
  addComment(){
    let commentObj = {...this.commentServ.newComment};
    commentObj.author = this.sessionInfo.userProfile.name;
    commentObj.comment = this.comment;
    commentObj.picUrl = this.sessionInfo.userProfile.picUrl;
    commentObj.uid = this.sessionInfo.userProfile.uid;
    let servicedoc = {collectionName:'issue',id:this.issue.id};
    this.commentServ.addComment(commentObj,servicedoc)
    .then((res)=>{
    //  console.log("comment add resposnse",res);
      this.comment = '';
    })
    .catch(error=>console.log(error));
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }
}
