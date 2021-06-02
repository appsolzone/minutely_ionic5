import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { UserCommentService } from 'src/app/shared/user-comment/user-comment.service';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-risk-user-comments',
  templateUrl: './risk-user-comments.page.html',
  styleUrls: ['./risk-user-comments.page.scss'],
})
@Autounsubscribe()
export class RiskUserCommentsPage implements OnInit,OnDestroy {

  // observables
  sessionSubs$;
  riskComments$;

  public sessionInfo: any;
  public risk: any;
  public allComments:any;
  public postedComment:string ='';
  public commentObj;
  constructor(
    private router: Router,
    private session: SessionService,
    private commentServ:UserCommentService,
    private componentService:ComponentsService,
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    let riskStateData = history.state.data.risk;
    if(!riskStateData){
      console.log("ngOnInit")
      this.router.navigate(['risk']);
    } else{
      if(riskStateData?.id!=this.risk?.id){
        this.getRiskComments(riskStateData);
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
        this.getRiskComments(riskStateData);
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


  getRiskComments(riskStateData){
    this.risk = riskStateData;
    this.commentObj = {...this.commentServ.newComment};
    // let allComments = [];
    this.riskComments$ = this.commentServ.fetchAllComments('risk',riskStateData.id)
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
    let servicedoc = {collectionName:'risk',id:this.risk.id,members:[{...this.risk.riskOwner},{...this.risk.riskInitiator}]};
    this.commentServ.addComment(commentObj,servicedoc,this.sessionInfo)
    .then((res)=>{
      console.log("comment add resposnse",res);
      this.postedComment = '';
      this.componentService.hideLoader();
      this.componentService.presentToaster('Your comment add successfully!!');
    })
    .catch(error=>{
      this.componentService.hideLoader();
      console.log(error)
    });
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }
}
