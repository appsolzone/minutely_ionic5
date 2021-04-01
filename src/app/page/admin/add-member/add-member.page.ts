import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
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
export class AddMemberPage implements OnInit,OnChanges {
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
  adminUserForm:any;
  // adminUserForm = new FormGroup({
  //   name: new FormControl(''),
  //   desctiption: new FormControl(''),
  //   email: new FormControl(''),
  //   phone: new FormControl(''),

  // });
  constructor(
    private session:SessionService,
    private componentService:ComponentsService,
    private router:Router,
    public AdminAddService:AdminAddUsersService,
    public manageUserService:ManageuserService,
    private formBuilder: FormBuilder
  ) {
    this.userRoles = this.AdminAddService.newMemberAddRoles;
    this.addUserData = {...this.manageUserService.newUser};

    this.adminUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      role: ['', Validators.required],

      
    });

  //   this.adminUserForm = new FormGroup({
  //     name: new FormControl(),
  //     description: new FormControl(),
  //     email: new FormControl(),
  //     phone: new FormControl(),
  //     role: new FormControl(),

  //  });
  }

  ngOnInit() {
    // get session info
    this.getSessionInfo();
  }

  //reset function
  ngOnChanges(){

  }

   ionViewWillEnter(){

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

 

  resetAddUserForm(){
    this.addUserData = {...this.manageUserService.newUser};
    this.adminUserForm.reset();

   // this.adminUserForm.reset(this.adminUserForm.value);
    
    // this.adminUserForm.form.controls['description'].markAsPristine();4
    // markFormGroupTouched(this.adminUserForm)
    // FormGroup.markAllAsTouched('f');
  }
  async onSubmit(){
    if(this.orgProfile.noOfFreeLicense>0){
      if(this.addUserData.name !== '' && this.addUserData.email !== ''&& this.addUserData.role !== '' && this.addUserData.jobtitle !== '' && this.addUserData.phone !== ''){
      await this.AdminAddService.addNewUser(this.addUserData,this.orgProfile);
      this.addUserData = {...this.manageUserService.newUser};
    this.adminUserForm.reset();

     }else{
      this.componentService.presentAlert("Error","Please fill all input field.");
      //  this.addUserData = {...this.manageUserService.newUser};
    // this.adminUserForm.reset(this.adminUserForm.value)
    // this.adminUserForm.reset();

     }
    }else {
      this.componentService.presentAlert("Error","No free licence available. Please upgrade plan to add new ACTIVE users.");
      this.addUserData = {...this.manageUserService.newUser};
    this.adminUserForm.reset();


    }
}


}
