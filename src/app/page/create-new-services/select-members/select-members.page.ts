import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { ActionSheetController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { ManageuserService } from 'src/app/shared/manageuser/manageuser.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-select-members',
  templateUrl: './select-members.page.html',
  styleUrls: ['./select-members.page.scss'],
})
@Autounsubscribe()
export class SelectMembersPage implements OnInit,OnDestroy {
  //observables
  initiateData$:any;
  sessionSubs$;
  fetchAllMembers$;


  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;


  allMembers:any = [];
  allMembersCopy:any = [];
  selectedMembers:any = [];
  selectMemberUsingRadionBtn:any;
  filterCategory: any = "all";
  textSearch: any = "";
  previousSelectedMembers:any = [];

  constructor(
    private _crud:CrudService,
    private _router:Router,
    private _session:SessionService,
    private _componentService:ComponentsService,
    private _manageUserServ:ManageuserService,
    public _actionSheetController: ActionSheetController,
  ) { }

  ngOnInit() {
    // get session info
    this.getSessionInfo();
    this.previousResponse();
  }
  ngOnDestroy(){
   // this._crud.crud_action$.unsubscribe();
  }


  ionViewWillEnter(){
  this.fetchAllMembers();
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
  previousResponse(){
  this._crud.crud_action$.subscribe(res=>{
    this.initiateData$ = res;
    // //if(this.initiateData$.service == 'meeting'){
    // this.previousSelectedMembers = this.initiateData$.object.selectedMembers;
    console.log(res)
  });  
  }
  fetchAllMembers(){
  this.selectedMembers = [];  
  let queryObj = [
      {
        field:'subscriberId',
        operator:'==',
        value:this.orgProfile.subscriberId
      },{
        field:'status',
        operator:'==',
        value:'ACTIVE'  
      }
    ]
    this.fetchAllMembers$ = this._manageUserServ.fetchAllUsers(queryObj)
    .pipe(
        map((actions: any[]) => actions.map((a: any) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          let statusCheck = this.initiateData$.object.selectedMembers.findIndex((u,i)=>{ return u.email == data.email}, data);
          let checked = statusCheck !=-1?true:false;
          let user = { id, ...data, checked };
          if(checked){
            this.selectedMembers.push({...user});
          }
          // console.log("now selected members",this.selectedMembers);
          return {...user};
        }))
      )
    .subscribe((data)=>{
    this.allMembers = data;
    this.allMembersCopy = data;
    })
  }
  
  // resuseable filter admin section & user section
  filterAllMembers(){
    console.log("calling",this.filterCategory);
    this.allMembers = this.allMembersCopy.filter((item) => {
    if(this.filterCategory == "others"){
      return item.name.toLowerCase().indexOf(this.textSearch.toLowerCase()) > -1 && (item.status != "ACTIVE" && item.status != "REGISTERED" );
    }else if(this.filterCategory == "active"){
      return item.name.toLowerCase().indexOf(this.textSearch.toLowerCase()) > -1 && item.status == "ACTIVE";
    }else if(this.filterCategory == "new"){
      return item.name.toLowerCase().indexOf(this.textSearch.toLowerCase()) > -1 && item.status == "REGISTERED";
    }else{
      return item.name.toLowerCase().indexOf(this.textSearch.toLowerCase()) > -1;
    }
  });
  }


  // making list of selected users
  pushOrRemoveMember(e, data)
  {
    console.log("calling here");
    let index = this.selectedMembers.findIndex((u,i)=>{ return u.email == data.email}, data);
    if(e.target.checked){
      data.checked = true;
      if(index == -1){
        this.selectedMembers.push({...data});
      }
    console.log("now selected member if",this.selectedMembers)
    } else {
      if(index !=-1){
        this.selectedMembers.splice(index, 1);
      }
     data.checked = false;
     console.log("now selected member else",this.selectedMembers)
    }
  }
    // making list of selected users
  pushOrRemoveMemberRadioBtn()
  {
    // console.log("calling here");
    this.selectedMembers = [];
    this.selectedMembers.push({...this.selectMemberUsingRadionBtn});
    console.log("radio signal",this.selectedMembers);
  }

  backToPreviousPage(){
  this.toNavigate(`Create New ${this.initiateData$.service}`,'initiate')
  }

  formTwoSubmit(){
    if(this.selectedMembers.length > 0)
      {
      this.initiateData$.object.selectedMembers = this.selectedMembers;
      console.log("now we get",this.initiateData$)
     } 
    console.log("now we get",this.initiateData$)  
   this.toNavigate('Add details','description');
  }

  toNavigate(header,path){
    console.log("now the path is",`/${this.initiateData$.service}/${path}`);
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
}
