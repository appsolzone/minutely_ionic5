import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { Comment } from 'src/app/interface/comment';
import { map } from 'rxjs/operators';
import { SessionService } from 'src/app/shared/session/session.service';
import { User } from 'src/app/interface/user';
import { DatabaseService } from 'src/app/shared/database/database.service';
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
  constructor(
    private crud:CrudService,
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

  ionViewWillEnter(){
    this.componentService.showLoader()
    this.passObj$ = this.crud.detailsPagePasing$.subscribe(
      (res)=>{
        if(res == undefined) this.router.navigate(["/profile"]);
        this.passObj = res;
        console.log("this details :",this.passObj);
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
  fetchAllComments(){
   this.allComments$ = this.crud.fetchAllComments(this.passObj.parentModule,this.passObj.id)
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
      let objectAdd:Comment = {
        author:this.userProfile.name,
        comment:this.commentTxt,
        picUrl:this.userProfile.picUrl,
        uid:this.userProfile.uid,
        date:this.db.frb.firestore.FieldValue.serverTimestamp(),
        totalComment:this.db.frb.firestore.FieldValue.increment(1)
      }
      this.crud.addComment(objectAdd,this.passObj)
      .then(res=>{
        console.log(res);
         this.commentTxt = '';
        this.componentService.presentToaster('Your comment add successfully!!');
      })
      .catch(err=>{console.log(err);this.componentService.presentAlert('Error',"Somting wents wrong! Please try again")});
     
    }

  }
}
