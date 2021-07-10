import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { UserCommentService } from 'src/app/shared/user-comment/user-comment.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { SpeechService } from 'src/app/shared/speech/speech.service';

@Component({
  selector: 'app-task-user-comments',
  templateUrl: './task-user-comments.page.html',
  styleUrls: ['./task-user-comments.page.scss'],
})
@Autounsubscribe()
export class TaskUserCommentsPage implements OnInit,OnDestroy {

  // observables
  sessionSubs$;
  taskComments$;

  public sessionInfo: any;
  public task: any;
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
    let taskStateData = history.state.data.task;
    if(!taskStateData){
      console.log("ngOnInit")
      this.router.navigate(['task']);
    } else{
      if(taskStateData?.id!=this.task?.id){
        this.getTaskComments(taskStateData);
      }
    }
  }

  ngOnDestroy(){}

  ionViewDidEnter(){
    console.log("taskDetails ionViewDidEnter", history.state.data?.task)
    let taskStateData = history.state.data?.task ? history.state.data.task : this.task;
    if(!taskStateData){
      console.log("ionViewDidEnter")
      this.router.navigate(['task']);
    } else {
      if(taskStateData?.id!=this.task?.id){
        this.getTaskComments(taskStateData);
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


  getTaskComments(taskStateData){
    this.task = taskStateData;
    this.commentObj = {...this.commentServ.newComment};
    this.taskComments$ = this.commentServ.fetchAllComments('task',taskStateData.id)
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
    let servicedoc = {collectionName:'task',id:this.task.id,members:[{...this.task.taskOwner},{...this.task.taskInitiator}]};
    this.commentServ.addComment(commentObj,servicedoc,this.sessionInfo)
    .then((res)=>{
      console.log("comment add resposnse",res);
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
