import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { Meeting } from 'src/app/interface/meeting';
import { User } from 'src/app/interface/user';

import { ComponentsService } from 'src/app/shared/components/components.service';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
@Autounsubscribe()
export class PreviewPage implements OnInit,OnDestroy {
  //observables
  initiateData$:any;
  sessionSubs$;
  fetchAllMembers$;


  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;
  allTags:any[];
  addThisTag: string = '';

  constructor(
    private _crud:CrudService,
    private _router:Router,
    private _session:SessionService,
    private _componentsService:ComponentsService
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
    this.initiateData$.object.tags;
    console.log("description page",res);
  });
  //this._crud.crud_action$.unsubscribe();
  }

  backToPreviousPage(){
  this.toNavigate('Add details','description')
  }

  submit(){
   console.log("Full meeting object",this.initiateData$.object);
  // this.toNavigate('Preview And submit','preview');
  }

  toNavigate(header,path){
    let actions = this._crud.crud_action;
    actions = {
      service:this.initiateData$.service,
      type:this.initiateData$.type,
      header:header,
      parentModule:this.initiateData$.parentModule,
      object:this.initiateData$.object
    }
    this._crud.crud_action$.next(actions);
    this._router.navigate([`/${this.initiateData$.parentModule}/${path}`]);
  }

    // adding tags
  addTags(){
    if(this.addThisTag && this.addThisTag!=""){
      this.initiateData$.object.tags.push(this.addThisTag);
      this.addThisTag = '';
    }
  }
  // delete tags
  deleteTag(toBeDeleted){
    let index = this.initiateData$.object.tags.indexOf(toBeDeleted);
    this.initiateData$.object.tags.splice(index, 1);
  }
    // form final submit
  formFourSubmit()
  {
      if(this.initiateData$.service == 'Meeting'){
      this._componentsService.showLoader();

      // This is the basic meeting doc
      let startDate = new Date(this.initiateData$.object.meetingDate + "T" + this.initiateData$.object.meetingStarts);
      let endDate = new Date(this.initiateData$.object.meetingDate + "T" +this.initiateData$.object.meetingEnds);

      let attendeeObj = this.attendeeList(this.initiateData$.object.selectedMembers);
      // let searchStrings = this.initiateData$.object.title + ' ' +
      //                     this.initiateData$.object.tags.join(' ') +
      //                     attendeeObj.nameText +
      //                     ' OPEN';
      // let titleSearchMap = this.searchMap.createSearchMap(searchStrings);
      // Now add the uidMap of attendees to the searchMap
      // Object.assign(titleSearchMap,attendeeObj.uidMap);
      let meetingBasics:any = {
        'subscriberId' : this.orgProfile.subscriberId,
        'ownerId': this.initiateData$.object.ownerId,
        'meetingTitle': this.initiateData$.object.title,
        // 'titleSearchMap': titleSearchMap,
        'meetingStart': startDate,
        'meetingEnd' : endDate,
        'attendeeList': attendeeObj.data,
        'attendeeUidList': attendeeObj.uidList,
        'agendas' : this.initiateData$.object.agendas,
        'notes': this.initiateData$.object.notes,
        'tags': this.initiateData$.object.tags,
        'meetingPlace': this.initiateData$.object.meetingPlace ? this.initiateData$.object.meetingPlace : {},
        'callList' : this.initiateData$.object.callList,
        'status': "OPEN",
      }
      //let eventDetails = {...this.initiateData$.object,...meetingBasics};
      this._crud.transaction(this.orgProfile,this.initiateData$.object,meetingBasics);
    }else{
      this._crud.add_risk_issue_task(this.initiateData$.parentModule,this.initiateData$.object,this.orgProfile)
    }
    }
  attendeeList(parameter: any)
  {
    let data = [];
    let nameText = '';
    let uidMap = {};
    let uidList =[];
    for(var i = 0; i < parameter.length; i ++)
    {
      data.push({
        uid: parameter[i].uid,
        name: parameter[i].name,
        picUrl: parameter[i].picUrl,
        attendance: false,
        accepted: 'invited',
        email: parameter[i].email
      });
      uidMap[parameter[i].uid] = true;
      uidList.push(parameter[i].uid);
      nameText += ' ' + parameter[i].name;
    }
    // Include owner uid and name for search text and uidMap
    nameText += ' ' + this.userProfile.name;
    uidMap[this.userProfile.uid] = true;
    if(!uidList.includes(this.userProfile.uid)){
      uidList.push(this.userProfile.uid);
    }

    return { data: data, nameText: nameText, uidMap: uidMap, uidList: uidList };
  }
  }
