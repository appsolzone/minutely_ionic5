import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interface/user';

import { ComponentsService } from 'src/app/shared/components/components.service';
import { ManageuserService } from 'src/app/shared/manageuser/manageuser.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit,OnChanges {

  // observables
  sessionSubs$;
  fetchAllMembers$;

  userData: any;
  id: string;
  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;

  addMember:boolean = false;
  allMembers:any = [];
  allMembersCopy:any = [];
  filterCategory: any = "all";
  textSearch: any = "";
  constructor(
    private session:SessionService,
    private componentService:ComponentsService,
    private router:Router,
    private adminManageUserServ:ManageuserService,
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    // get session info
    this.getSessionInfo();
  }
  ngOnChanges(){

  }
   ionViewWillEnter(){
    this.fetchAllMembers();
   }

   gotoAddMemberPage(){
     this.router.navigate(['/admin/add-member']);
   }


   getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
       console.log("Session Subscription got", value);

       // Re populate the values as required
       this.userProfile = value?.userProfile;
       this.orgProfile = value?.orgProfile;


       if(this.userProfile){
         // Nothing to do just display details
       } else {
          this.router.navigate(['profile']);
       }
     });
  }

  fetchAllMembers(){
    this.fetchAllMembers$ = this.adminManageUserServ.fetchAllUsers(this.orgProfile)
    .pipe(
        map((actions: any[]) => actions.map((a: any) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
    .subscribe((data)=>{
    this.allMembers = data;
    this.allMembersCopy = data;
    console.log("all members list",this.allMembers);
    this.filterAllMembers();
    })
  }

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
    console.log('after filter all members',this.allMembers)
    }
    async filterMemberActionSheet() {
    console.log("calling",this.filterCategory);
    const actionSheet = await this.actionSheetController.create({
      header: 'Filter all members',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'All',
        role: 'all',
        icon: 'body-outline',
        handler: () => {
         this.filterCategory = 'all';
         this.filterAllMembers();
        }
      }, {
        text: 'Active members',
        icon: 'checkmark-outline',
        handler: () => {
         this.filterCategory = 'active';
         this.filterAllMembers();
        }
      }, {
        text: 'New Users',
        icon: 'clipboard-outline',
        handler: () => {
         this.filterCategory = 'new';
         this.filterAllMembers();
        }
      }, {
        text: 'Others',
        icon: 'man-outline',
        handler: () => {
         this.filterCategory = 'others';
         this.filterAllMembers();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
    // present sheet for actions
 async memberManageActionSheet(data) {
    console.log("member current status:",data.status);
    if(data.email == this.userProfile.email){
      this.componentService.presentAlert("Error","You can't amend your own access or role details.");
    }else{
      let btns = [];
      if(data.status == 'ACTIVE'){ // when user is active
        btns.push({ text: 'Suspend access', handler: () => { this.adminManageUserServ.userDataUpdateTransection( data, 'SUSPENDED', this.orgProfile ); } });
        btns.push({ text: 'Mark as leaver', handler: () => { this.adminManageUserServ.userDataUpdateTransection( data, 'LEAVER',this.orgProfile ); } });

        if(data.role=='USER'){
          btns.push({ text: 'Assign Admin Role', handler: () => { this.adminManageUserServ.changeUserRole( data, 'ADMIN' ); } });
          btns.push({ text: 'Approve external access', handler: () => { this.adminManageUserServ.changeUserRole( data, 'EXTERNAL'); } });
        } else {
          btns.push({ text: 'Assign User Role', handler: () => { this.adminManageUserServ.changeUserRole( data, 'USER' ); } });
        }
      }else if(data.status == 'REJECTED'){ // when user is rejected
        if (this.orgProfile.noOfFreeLicense > 0)
          btns.push({ text: 'Approve access', handler: () =>{ this.adminManageUserServ.userDataUpdateTransection( data, 'ACTIVE',this.orgProfile ); } });
      }else if(data.status == 'REGISTERED'){ // when user is just registered
        btns.push({ text: 'Reject request', handler: () => { this.adminManageUserServ.changeUserRole( data, 'REJECTED'); } });
        if (this.orgProfile.noOfFreeLicense > 0)
          btns.push({ text: 'Approve access', handler: () =>{ this.adminManageUserServ.userDataUpdateTransection( data, 'ACTIVE',this.orgProfile ); } });

      }else if(data.status == 'SUSPENDED' || data.status == 'LEAVER'){ // when user already suspended
        if (this.orgProfile.noOfFreeLicense > 0)
          btns.push({ text: 'Re-activate access', handler: () =>{ this.adminManageUserServ.userDataUpdateTransection( data, 'ACTIVE',this.orgProfile ); } });
          btns.push({ text: 'Approve external access', handler: () =>{ this.adminManageUserServ.userDataUpdateTransection( data, 'EXTERNAL',this.orgProfile ); } });
      }else if(data.status == 'EXTERNAL'){ // when user is rejected
        btns.push({ text: 'Suspend access', handler: () =>{ this.adminManageUserServ.userDataUpdateTransection( data, 'SUSPENDED',this.orgProfile ); } });
        btns.push({ text: 'Approve access', handler: () =>{ this.adminManageUserServ.changeUserRole( data, 'USER'); } });
      }else{ // when user left the organization
        if (this.orgProfile.noOfFreeLicense > 0)
          btns.push({ text: 'Approve access', handler: () =>{ this.adminManageUserServ.userDataUpdateTransection( data, 'ACTIVE',this.orgProfile ); } });
      }
      // default button
      btns.push({ text: 'Cancel', role: 'cancel', handler: () => {  } });
      // create alert
      let actionSheet = await this.actionSheetController.create({
        header: 'Amend access for ' + data.name,
       cssClass: 'my-custom-class',
        buttons: btns
      });
      await actionSheet.present();
    }
  }
}
