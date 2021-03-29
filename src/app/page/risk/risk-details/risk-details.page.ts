import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.page.html',
  styleUrls: ['./risk-details.page.scss'],
})

@Autounsubscribe()
export class RiskDetailsPage implements OnInit,OnDestroy {
  // observables
  sessionSubs$;
  risk$;

  userData: any;
  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;

  //variable
  risk:any|null = null;
  riskCopy:any|null = null;
  toggleEditMode:boolean = false;

  status:string='';
  maxMeetingDate: any = moment().add(20,'years').format("YYYY");
  minMeetingDate: any = moment().format("YYYY-MM-DD");
  date: any;

  addThisTag:string;
  
  constructor(
    private crud:CrudService,
    private componentService:ComponentsService,
    private router:Router,
    private session:SessionService,
    ) { }

  ngOnInit() {
    this.getSessionInfo();
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
   // this.componentService.showLoader()
    this.risk$ = this.crud.detailsPagePasing$.subscribe(
      (res)=>{
        this.risk = res;
        this.riskCopy = res;
        console.log("this details :",this.risk);
        if(res == null) this.router.navigate(["/risk"]);
      },
      (err)=>{
        console.log(err);
      },
      ()=>{
        //this.componentService.hideLoader()
      }
      );
  }

  goToCommentPage(risk){
   let passObj = {...risk,parentModule:'risk',navigateBack:'/risk/details'};
   this.crud.detailsPagePasing$.next(passObj);
   this.router.navigate(['/risk/details/comments']); 
  }

  goToSelectMemberPage(){
   let crud_action = {
    service:'Risk',     // Meeting,Risk,Issue,Task
    type:'update',        // create,update
    parentModule:'risk',    //meeting,risk,issue,task
    header:'Update new risk owner',      // header on page
    object:{...this.risk},      // initiate object
    }
    this.crud.detailsPagePasing$.next(crud_action.object);
    // this.router.navigate(['/risk/details/select-members']); 

    console.log("this latest details condition :",this.risk)
  }


  // ====== [ tags ] =========
  // adding tags
  addTags(){
    if(this.addThisTag && this.addThisTag!=""){
      this.risk.tags.push(this.addThisTag);
      this.addThisTag = '';
    }
  }
  // delete tags
  deleteTag(toBeDeleted){
    let index = this.risk.tags.indexOf(toBeDeleted);
    this.risk$.tags.splice(index, 1);
  } 

  //editMode
  editMode(){

    console.log("the current risk data ====",this.risk);
    this.toggleEditMode = !this.toggleEditMode;
    this.risk = this.riskCopy;
  }
}
