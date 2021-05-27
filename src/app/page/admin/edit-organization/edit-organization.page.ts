import { DatabaseService } from './../../../shared/database/database.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { AdminAddUsersService } from 'src/app/shared/admin-add-users/admin-add-users';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { ManageuserService } from 'src/app/shared/manageuser/manageuser.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { UploadImageService } from 'src/app/shared/uploadImage/upload-image.service';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.page.html',
  styleUrls: ['./edit-organization.page.scss'],
})
export class EditOrganizationPage implements OnInit {

  sessionSubs$;

  userData: any;
  id: string;
  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;

  addUserData:any;
  userRoles:any;
  editProfile:boolean=false;

  constructor(
    private session:SessionService,
    private componentService:ComponentsService,
    private router:Router,
    private upload: UploadImageService,
    private db:DatabaseService,
    public AdminAddService:AdminAddUsersService,
    public manageUserService:ManageuserService) {
      this.userRoles = this.AdminAddService.newMemberAddRoles;
      this.addUserData = {...this.manageUserService.newUser};
     }

     toggleEditMode(){
      this.editProfile = !this.editProfile;

    }

    takePhoto() {
      let source={
        'collection':this.db.allCollections.subscribers,
        'location':'orgProfileLogo',
        'document':this.userProfile.subscriberId

      }
    this.upload.takePhoto(source);

    }
    async onSubmit(){
      await this.componentService.showLoader("Saving profile data, please wait...");
      await this.updateProfile(this.orgProfile.subscriberId, this.orgProfile);
      this.editProfile = false;
      // hide the loader now
      setTimeout(()=>this.componentService.hideLoader(),100);
    }

    updateProfile(docId:string, orgProfile){
      return this.db.updateDocument(this.db.allCollections.subscribers, docId, orgProfile);
    }
    // skip profile update
    onSkip(){
      // if new user registred then save the data we received from provider
      if(!this.userProfile){
        this.onSubmit();
      }
      this.editProfile = false;
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

}
