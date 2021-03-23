import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-initiate',
  templateUrl: './initiate.page.html',
  styleUrls: ['./initiate.page.scss'],
})
@Autounsubscribe()
export class InitiatePage implements OnInit,OnDestroy {
  //observables
  initiateData$:any;
  sessionSubs$;

  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;

  //veriables
  maxMeetingDate: any = moment().add(20,'years').format("YYYY");
  minMeetingDate: any = moment().format("YYYY-MM-DD");
  formErrorCount: any = { date: true, time: true, ocuurence: false };
  toggleSwitch: boolean = false;
  selection: any;
  frequency: any = [...Array(29)];

  constructor(
    private _crud:CrudService,
    private _router:Router,
    private _componentService:ComponentsService,
    private _session:SessionService
  ) { }

  ngOnInit() {
    this.getSessionInfo();
    this._crud.crud_action$.subscribe(res=>{
    if(res){
    this.initiateData$ = res;
    console.log(res);
    }else{
      // this._router.navigate(['/profile']);
    }

  });
  }
  ngOnDestroy(){
    //this._crud.crud_action$.unsubscribe();
  }
  ionViewWillEnter(){
  }
    getSessionInfo(){
    this.sessionSubs$ = this._session.watch().subscribe(value=>{
      //  console.log("Session Subscription got", value);
       // Re populate the values as required
       if(this.userProfile && (!initiateData || value?.uid != this.userProfile?.uid || value?.subscriberId != this.userProfile?.subscriberId)){
         this._router.navigate(['task']);
       }
       this.userProfile = value?.userProfile;
       this.orgProfile = value?.orgProfile;
       if(this.userProfile){
         // Nothing to do just display details
       } else {
          this._router.navigate(['profile']);
       }
     });
  }

  compare_date(showAlert: boolean = true) {
    if(this.initiateData$.service == 'Meeting'){
    let isValidStartDate = !this.initiateData$.object.isOccurence || (this.initiateData$.object.occurenceType!='daily'
                            ||
                            (this.initiateData$.object.occurenceType=='daily'
                              && this.initiateData$.object.weekdays[parseInt(moment(this.initiateData$.object.startDate).format('e'))]
                              )
                          );

    if(moment().format('YYYY-MM-DD') <= this.initiateData$.object.startDate && isValidStartDate) {
      this.formErrorCount.date = false;
      return true;
    } else {
      if(showAlert){
        if(!isValidStartDate){
          this._componentService.presentAlert("Error","Invalid Meeting Start Date. Meeting start date should be on one of the weekdays selected for the meeting frequency. Please check and try again.");
        } else {
          this._componentService.presentAlert("Error","Invalid Meeting Date. Meeting cannot be set in past. The date should be today or later.");
        }
      }
      this.formErrorCount.date = true;
      return false;
    }
   }else{
      if(moment().format('YYYY-MM-DD') <= this.initiateData$.object.startDate) {
      this.formErrorCount.date = false;
      return true;
    } else {
      if(showAlert){
        this._componentService.presentAlert("Error",`Invalid ${this.initiateData$.service} Date. ${this.initiateData$.service} cannot be set in past. The date should be today or later.`);
      }
      this.formErrorCount.date = true;
      return false;
    }
   }
  }

  compare_time(showAlert: boolean = true) {
    let startTime  = this.initiateData$.object.startTime;
    let endTime = this.initiateData$.object.endTime;
    let date = this.initiateData$.object.startDate;
    let startDateTime = new Date(date + "T" + startTime);
    if(!startDateTime){
      this.formErrorCount.date = true;
      return false;
    } else if(!startTime || !endTime){
      this.formErrorCount.time = true;
      return false;
    } else if(startDateTime < new Date()) {
      if(showAlert){
        this._componentService.presentAlert("Error","Invalid Start Time. Meeting cannot be set in past. Meeting start time cannot be set prior to current time.");
      }
      this.formErrorCount.time = true;
      return false;
    } else if(startTime > endTime){
    if(showAlert){
      this._componentService.presentAlert("Error","Invalid End Time. Meeting end time should be later than the Meeting start time.");
    }
    this.formErrorCount.time = true;
    return false;
    } else {
      this.formErrorCount.time = false;
    return true;
    }
  }

  checkNoOfRecurringMeetings(showAlert: boolean = true){
    if(!this.initiateData$.object.noOfOccurence && this.initiateData$.object.isOccurence)  {
      if(showAlert){
        this._componentService.presentAlert("Error","No Recurring Events. No of recurring events is not set. Please select the no of recurring events.");
      }
      this.formErrorCount.ocuurence = true;
      return false;
    } else {
      this.formErrorCount.ocuurence = false;
      return true;
    }
  }

  // occurence check
  occurencetype(showAlert: boolean = true){
    if(!this.initiateData$.object.occurenceType && this.initiateData$.object.isOccurence) {
      if(showAlert){
        this._componentService.presentAlert("Error","No Recurring Events. No recurring frequency is selected for a recurring event. Please check and try again.");
      }
      this.formErrorCount.ocuurence = true;
      return false;
    } else {
      this.formErrorCount.ocuurence = false;
      return true;
    }
  }

  validationCheck(showAlert:boolean = false){
    if(this.initiateData$.object.title != null && this.initiateData$.object.title.trim() != '' &&
      this.compare_date(showAlert) && this.compare_time(showAlert) &&
      this.checkNoOfRecurringMeetings(showAlert) && this.occurencetype(showAlert) && this.initiateData$.service == 'Meeting'){
       return false;
    }else if(this.initiateData$.object.title != null && this.initiateData$.object.title.trim() != '' &&
      this.compare_date(showAlert) && this.initiateData$.service !== 'Meeting'){
       return false;
    } else {
       return true;
    }
  }
  formOneSubmit()
  {
    // console.log("form error",this.formErrorCount.ocuurence,this.formErrorCount.date,this.formErrorCount.time);
      if(!this.validationCheck(true))
      {
       console.log(this.initiateData$.object);
      this.initiateData$.object.ownerId = {
        name:this.userProfile.name,
        uid:this.userProfile.uid,
        picUrl:this.userProfile.picUrl,
        subscriberId:this.userProfile.subscriberId,
        email:this.userProfile.email
      }
      let actions = this._crud.crud_action;
      actions = {
        service:this.initiateData$.service,
        type:this.initiateData$.type,
        parentModule:this.initiateData$.parentModule,
        header:this.initiateData$.service == 'Meeting'?'Select Attendee':`Choose ${this.initiateData$.service} Owner`,
        object:this.initiateData$.object
      }
      this._crud.crud_action$.next(actions);
      this._router.navigate([`/${this.initiateData$.parentModule}/select-members`]);
      }
  }
}
