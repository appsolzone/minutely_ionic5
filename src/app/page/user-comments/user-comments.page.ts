import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { Comment } from 'src/app/interface/comment';
import { map } from 'rxjs/operators';
import { SessionService } from 'src/app/shared/session/session.service';
import { User } from 'src/app/interface/user';
import { DatabaseService } from 'src/app/shared/database/database.service';
import { UserCommentService } from 'src/app/shared/user-comment/user-comment.service';
import { CrudService } from 'src/app/shared/crud/crud.service';
@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.page.html',
  styleUrls: ['./user-comments.page.scss'],
})
@Autounsubscribe()
export class UserCommentsPage implements OnInit,OnDestroy {
  //observable
  passObj$;
  allComments$;
  sessionSubs$;
  //variables
  passObj:any|null = null;
  allComments:Array<Comment> = [];
  commentTxt:string = '';
  userProfile:User;
  orgProfile:Object;
  emailReceiverMembers:any;
  constructor(
    private crud:CrudService,
    private comment:UserCommentService,
    private componentService:ComponentsService,
    private router:Router,
    private session:SessionService,
    private db:DatabaseService
  ) { }

  ngOnInit() {
   this.getSessionInfo() 
  }
  ngOnDestroy(){}

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      console.log("testing :",value?.userProfile?true:false);
       if(value?.userProfile){
       // Nothing to do just display details
       // Re populate the values as required
       this.userProfile = value?.userProfile;
       this.orgProfile = value?.orgProfile;
       } else {
          this.router.navigate(['profile']);
       }
     });
  }

  ionViewWillEnter():void{
    this.allComments = [];
    this.componentService.showLoader()
    this.passObj$ = this.crud.detailsPagePasing$.subscribe(
      (res)=>{
        if(res == undefined) this.router.navigate(["/profile"]);
        this.passObj = res;
        console.log("this details :",this.passObj);
        this.setOwnerInitiator(this.passObj);
        this.fetchAllComments();
      },
      (err)=>{
        console.log(err);
        this.componentService.hideLoader();
      },
      ()=>{
        //this.componentService.hideLoader()
      }
      );
  }
  setOwnerInitiator(serviceObject){
    this.emailReceiverMembers = [];
    this.emailReceiverMembers.push(
      {email:serviceObject[`${serviceObject.parentModule}Initiator`].email,
      name:serviceObject[`${serviceObject.parentModule}Initiator`].name},
      {email:serviceObject[`${serviceObject.parentModule}Owner`].email,
      name:serviceObject[`${serviceObject.parentModule}Owner`].name});

    console.log(this.emailReceiverMembers);  
  }

  fetchAllComments(){
   this.allComments$ = this.comment.fetchAllComments(this.passObj.parentModule,this.passObj.id)
                       .pipe(
                          map((allComments:Array<Comment>)=>{
                          return allComments.map((comment:any)=>{
                            let data = comment.payload.doc.data() as Comment;
                            return data;
                          })
                         })
                       ).subscribe((res:Array<Comment>)=>{
                         this.allComments = res;
                         console.log("all comments we get :",this.allComments);
                         this.componentService.hideLoader();
                        },
                        error=>{
                          console.log(error);
                          this.componentService.hideLoader();
                        })
  }
  add_cmt(){
    if(this.commentTxt != ''){
      let commentObject:Comment = {
        author:this.userProfile.name,
        comment:this.commentTxt,
        picUrl:this.userProfile.picUrl,
        uid:this.userProfile.uid,
        date:this.db.frb.firestore.FieldValue.serverTimestamp(),
        totalComment:this.db.frb.firestore.FieldValue.increment(1)
      }
      this.comment.addComment(commentObject,this.passObj)
      .then(res=>{
        console.log(res);
        this.commentTxt = '';
        this.componentService.presentToaster('Your comment add successfully!!');
        this.comment.sendEmail(this.emailReceiverMembers,commentObject,this.passObj)
      })
      .catch(err=>{console.log(err);this.componentService.presentAlert('Error',"Somting wents wrong! Please try again")});
     
    }

  }
}
