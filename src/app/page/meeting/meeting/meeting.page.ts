import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.page.html',
  styleUrls: ['./meeting.page.scss'],
})
@Autounsubscribe()
export class MeetingPage implements OnInit,OnDestroy {
  // observables
  sessionSubs$;

  userData: any;
  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;
  constructor(
    private _router:Router,
    private _crud:CrudService,
    private _session:SessionService
  ) { }

  ngOnInit() {
     this.getSessionInfo();
   
  }
  ionViewWillEnter(){
      this._crud.crud_action$.next(undefined);
  }
  ngOnDestroy(){}
  
  getSessionInfo(){
    this.sessionSubs$ = this._session.watch().subscribe(value=>{
       if(value?.userProfile){
       // Nothing to do just display details
       // Re populate the values as required
       this.userProfile = value?.userProfile;
       this.orgProfile = value?.orgProfile;
       } else {
        //  this._router.navigate(['profile']);
       }
     });
  }
  navigateCreateMeeting(){
   let actions = this._crud.crud_action; 
   actions = {
     service:'Meeting',
     type:'create',
     parentModule:'meeting',
     header:'Create new meeting',
     object:this._crud.passingObj
   } 
   this._crud.crud_action$.next(actions);
   this._router.navigate(['/meeting/initiate']);
  }
}
