import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { AdminAddUsersService } from 'src/app/shared/admin-add-users/admin-add-users';
import { ComponentsService } from 'src/app/shared/components/components.service';
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
    public AdminAddService:AdminAddUsersService
  ) { 
    this.addUserData = {role:'',name:"",jobTitle:"",email:"",phone:''};
    this.userRoles = this.AdminAddService.newMemberAddRoles;
    console.log(this.userRoles);
  }

  ngOnInit() {
    // get session info
    this.getSessionInfo();
  }

  //reset function
  // ngOnChanges(){
  //   if(this.mood){
  //   this.addUserData = {role:'',name:"",jobTitle:"",email:"",phone:''};
  //   };
  // }

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
       console.log("this add user data",this.addUserData);
       console.log("org profile from comp",this.orgProfile);
       this.AdminAddService.addNewUser(this.addUserData,this.orgProfile);
     }else{
      this.componentService.presentAlert("Error","Please fill all input field.");
     }
    }else {
      this.componentService.presentAlert("Error","No free licence available. You can only add external users now. Please buy additional lincece to add new ACTIVE users.");
    }
}


}