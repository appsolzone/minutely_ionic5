import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { AdminAddUsersService } from 'src/app/shared/admin-add-users/admin-add-users';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { ManageuserService } from 'src/app/shared/manageuser/manageuser.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.page.html',
  styleUrls: ['./add-member.page.scss'],
})
export class AddMemberPage implements OnInit {
 // @Input() mood:any;
  // observables
  sessionSubs$;

  userData: any;
  id: string;
  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;
  
  addUserData:any;
  userRoles:any;
  constructor(
    private session:SessionService,
    private componentService:ComponentsService,
    private router:Router,
    public AdminAddService:AdminAddUsersService,
    public manageUserService:ManageuserService
  ) { 
    this.addUserData = this.manageUserService.newUser;
    this.userRoles = this.AdminAddService.newMemberAddRoles;
  }

  ngOnInit() {
    // get session info
    this.getSessionInfo();
  }

  //reset function
  ngOnChanges(){

  }

   ionViewWillEnter(){
     //this.today = new Date();
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
  onSubmit(){
    if(this.orgProfile.noOfFreeLicense>0){
      if(this.addUserData.name !== '' && this.addUserData.email !== ''&& this.addUserData.role !== '' && this.addUserData.jobtitle !== '' && this.addUserData.phone !== ''){
      let result = this.AdminAddService.addNewUser(this.addUserData,this.orgProfile);
      if(result) this.addUserData = this.manageUserService.newUser;
     }else{
      this.componentService.presentAlert("Error","Please fill all input field.");
     }
    }else {
      this.componentService.presentAlert("Error","No free licence available. You can only add external users now. Please buy additional lincece to add new ACTIVE users.");
    }
}


}