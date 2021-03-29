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
  public sessionInfo: any;
  public risk: any;

  //variable
  public riskCopy:any|null = null;
  public toggleEditMode:boolean = false;

  status:string='';
  maxMeetingDate: any = moment().add(20,'years').format("YYYY");
  minMeetingDate: any = moment().format("YYYY-MM-DD");
  date: any;

  addThisTag:string;
  
  constructor(
    private crud:CrudService,
    private router:Router,
    private session:SessionService,
    ) {
        this.getSessionInfo();
     }

  ngOnInit() {
    this.risk = history.state.data.risk;
    console.log("riskDetails ngOnInit",this.risk)
    if(!this.risk){
      console.log("ngOnInit")
      this.router.navigate(['risk']);
    }
  }
  ngOnDestroy(){}

  getSessionInfo(){
   this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // Re populate the values as required
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

  ionViewDidEnter(){
    console.log("riskDetails ionViewDidEnter", history.state.data?.risk)
    this.risk = history.state.data?.risk ? history.state.data.risk : this.risk;
    console.log(this.risk)
    if(!this.risk){
      console.log("ionViewDidEnter")
      this.router.navigate(['risk']);
    }
  }


  goToCommentPage(risk){
   let passObj = {...risk,parentModule:'risk',navigateBack:'/risk/risk-details'};
   this.crud.detailsPagePasing$.next(passObj);
   this.router.navigate(['/risk/risk-details/comments']); 
  }

  // goToSelectMemberPage(){
  //  let crud_action = {
  //   service:'Risk',     // Meeting,Risk,Issue,Task
  //   type:'update',        // create,update
  //   parentModule:'risk',    //meeting,risk,issue,task
  //   header:'Update new risk owner',      // header on page
  //   object:{...this.risk},      // initiate object
  //   }
  //   this.crud.detailsPagePasing$.next(crud_action.object);
  //   // this.router.navigate(['/risk/details/select-members']); 

  //   console.log("this latest details condition :",this.risk)
  // }


  // // ====== [ tags ] =========
  // // adding tags
  // addTags(){
  //   if(this.addThisTag && this.addThisTag!=""){
  //     this.risk.tags.push(this.addThisTag);
  //     this.addThisTag = '';
  //   }
  // }
  // // delete tags
  // deleteTag(toBeDeleted){
  //   let index = this.risk.tags.indexOf(toBeDeleted);
  //   this.risk.tags.splice(index, 1);
  // } 

  // //editMode
  // editMode(){

  //   console.log("the current risk data ====",this.risk);
  //   this.toggleEditMode = !this.toggleEditMode;
  //   this.risk = this.riskCopy;
  // }

}
