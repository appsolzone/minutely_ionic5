import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
})
@Autounsubscribe()
export class DescriptionPage implements OnInit,OnDestroy {
  //observables
  initiateData$:any;
  sessionSubs$;
  fetchAllMembers$;


  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;
  
  constructor(
    private _crud:CrudService,
    private _router:Router,
    private _session:SessionService,
  ) { }

  ngOnInit() {
    this.getSessionInfo();
    this.previousResponse(); 
  }
  ngOnDestroy(){
    //this._crud.crud_action$.unsubscribe();
  }
  getSessionInfo(){
  this.sessionSubs$ = this._session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      this.userProfile = value?.userProfile;
      this.orgProfile = value?.orgProfile;
      if(this.userProfile){
        // Nothing to do just display details
      } else {
        this._router.navigate(['profile']);
      }
    });
  }
  ionViewWillEnter(){

  }
  previousResponse(){
  this._crud.crud_action$.subscribe(res=>{
    this.initiateData$ = res;
    console.log("description page",res);
  });
  }

  backToPreviousPage(){
  this.toNavigate('Select members','select-members')
  }

  formThreeSubmit(){
  console.log("ageda",this.initiateData$.object);
   this.toNavigate('Preview And submit','preview');
  }

  toNavigate(header,path){
    let actions = this._crud.crud_action; 
    actions = {
      service:this.initiateData$.service,
      type:this.initiateData$.type,
      parentModule:this.initiateData$.parentModule,
      header:header,
      object:this.initiateData$.object
    } 
    this._crud.crud_action$.next(actions);
    this._router.navigate([`/${this.initiateData$.parentModule}/${path}`]);
  }
}
