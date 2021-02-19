import { appPages } from './../../shared/app-menu-pages';
import { UploadImageService } from './../../shared/uploadImage/upload-image.service';
import { ComponentsService } from './../../shared/components/components.service';
import { async } from '@angular/core/testing';
import { environment } from './../../../environments/environment';

import { DatabaseService } from 'src/app/shared/database/database.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Plugins } from '@capacitor/core';
import { AuthenticationService } from '../../shared/authentication/authentication.service';
import { ManageuserService } from '../../shared/manageuser/manageuser.service';
import { User } from '../../interface/user';
import { SessionService } from '../../shared/session/session.service';
import * as moment from 'moment';
import { SubscriberService } from 'src/app/shared/subscriber/subscriber.service';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import '@codetrix-studio/capacitor-google-auth';













const { Storage } = Plugins;


@Component({
  selector: 'app-manageprofile',
  templateUrl: './manageprofile.page.html',
  styleUrls: ['./manageprofile.page.scss'],
})
export class ManageprofilePage implements OnInit {
  // Observable
  getauthStateSubs$;
  public appPages = appPages;
  signinUi: any;
  userData: any;
  id: string;
  allProfiles: any[];
  userProfile: User;
  editProfile: boolean = false;
  updatedProfile: User;
  addSubscriber: boolean = false;
  emailRegex: string = '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';
  firestore: any;
  sessionInfo: any;
  photo: SafeResourceUrl;
  public base64Image: string;
  public isMobile: boolean = false;
  



  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private user: ManageuserService,
    private session: SessionService,
    private database: DatabaseService,
    private subscriber: SubscriberService,
    public actionSheetCtrl:ActionSheetController,
    private sanitizer: DomSanitizer,
    private common:ComponentsService,
    private upload: UploadImageService,
    private platform: Platform,
    public alertController: AlertController,


  ) {
    this.isMobile = this.platform.is('mobile') && !this.platform.is('mobileweb');
    this.firestore = this.user.db.frb.firestore;
    this.getauthStateSubs$ = this.auth.authState(this.authStateCallBack.bind(this));
    this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      this.sessionInfo = value;
      this.allProfiles = value?.allProfiles;
      if(this.allProfiles){
        if(this.allProfiles.length==0){
          this.addSubscriber = true;
        } else if(this.allProfiles.length==1){
          this.getUserProfile(0);
        } else {
          this.getLastSignInProfile();
        }
      }
      // // console.log("subscription end check", this.sessionInfo?.orgProfile?.subscriptionEnd);
      // // console.log("userProfile status check", this.sessionInfo?.userProfile?.status);

      // console.log('check_user',this.sessionInfo?.orgProfile,this.sessionInfo?.userProfile )
    





    });
    
  }



  performPostLoginChecks(){

    // if(this.sessionInfo?.orgProfile == undefined || this.sessionInfo?.userProfile == undefined){
    //   console.log('data undefined, nothing to do ');
    //   this.common.showLoader('Checking profile information');
    // }
    // else{
      
    // console.log('ghhhhhhhhhghghghghhghghghghghghghg');
    
    this.subscriber.checkOrg(this.sessionInfo?.orgProfile, this.sessionInfo?.userProfile)

    .then((res)=>{

      if(res){
      console.log('first function', res);

      this.user.checkUser(this.sessionInfo?.userProfile).then((result)=>{

        if(result){
          console.log('ok user');
          // this is the default path of the app if logged in successfully and no upgrade is required
        this.router.navigate([this.appPages[0].url]);



        }
      }).catch((err)=>{
       console.log('cant get user');
        //this.router.navigate(['profile']);
        this.common.presentAlert('Error','Your account is inactive, Please contact with the admin');
      this.signOut();
      this.addSubscriber = false;
      })

      }

    }).catch((gg)=>{
      // console.log('erorssssss', gg);
      this.renewNow(this.sessionInfo?.userProfile, this.sessionInfo?.orgProfile);

    })

    this.common.hideLoader();

  // }

  }



  async renewNow(userProfile, org) {
    console.log('my_org',org)
    const alert = await this.alertController.create({
      header: ['Free','FREE'].includes(org.subscriptionType) ? 'Upgrade Plan' : 'Renew Subscription',
      
      cssClass: 'my-custom-class',
      
      message: 'Your ' + (['Free','FREE'].includes(org.subscriptionType) ? 'trial period' : 'subscription') +
              ' has ended on ' + moment(org.subscriptionEnd.seconds*1000).format('ll') +
              ', please ' + (['Free','FREE'].includes(org.subscriptionType) ? 'upgrade' : 'renew') +
              ' your subscription now.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
            this.signOut()
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          this.router.navigate([this.appPages[3].url]);

            // this.toPayment({payment: org.paypalId, sid: userProfile.subscriberId}); 

          }
        }
      ]
    });

    await alert.present();
  }

  take_photo() {
    this.upload.take_photo();
  }



 








  ngOnInit() {

  }

  async signOut(){
    // this.common.showLoader("Please wait... signout");
    await Storage.remove({key: 'userProfile'});
    if(this.isMobile){
      await Plugins.GoogleAuth.signOut();
    }
    await this.auth.signOut();
    this.session.clear();
    // this.common.hideLoader();
    this.common.presentToaster("Signed out successfully. Please sign in again to continue.");
  }
  // cancel add subscriber
  cancelAddSubscriber(checkProfiles:boolean = true){
    if( checkProfiles && this.allProfiles.length==0){
      this.signOut();
      this.addSubscriber = false;
    } else {
      this.addSubscriber = false;
    }
  }

  authStateCallBack(data){
    // setTimeout(()=>{
      // this.signinUi = data.signinUi;
      // if we are receiving the data for the first time
      if(data.userData && !this.userData){
        //// console.log("if data.userData && this.userData", data.userData, this.userData);
        this.userData = data.userData;
        this.session.getProfiles(this.userData.uid);
      } else if(data.userData && this.userData){
        //// console.log("else if", data.userData, this.userData);
        this.userData = data.userData;
        // if userData is incomplete or Data does not exist activate edit mode
        this.incompleteProfile();
      } else {

        this.editProfile = false;
        this.userProfile=undefined;
        this.id = undefined;
        this.userData = data.userData;
        this.updatedProfile = undefined;

      }
      this.common.hideLoader();
  }

  incompleteProfile(){
    // if userData is incomplete or Data does not exist activate edit mode
    this.performPostLoginChecks();
    if(this.userData &&
       (
         !this.userProfile ||
         !this.userProfile.name ||
         !this.userProfile.phoneNumber ||
         !this.userProfile.address ||
         !this.userProfile.jobTitle
       )
      ){
      this.editProfile = true;
      // create a copy of the data, NOTE its a shallow copy!!!
      if(this.userProfile){
        this.updatedProfile = {...this.userProfile};
        this.updatedProfile.lastUpdateTimeStamp = this.firestore.FieldValue.serverTimestamp();
      } else {
        const {displayName, email, phoneNumber} = this.userData.providerData[0];
        this.id = this.userData.uid;
        this.updatedProfile = {
          uid: this.userData.uid,
          subscriberId: '',
          name: displayName,
          email: email,
          phoneNumber: phoneNumber ? phoneNumber : '',
          appRole: 'USER',
          jobTitle: '',
          address: '',
          status: 'CREATED',
          lastUpdateTimeStamp: this.firestore.FieldValue.serverTimestamp(),
          userCreationTimeStamp: this.firestore.FieldValue.serverTimestamp()
        };
      }
    } else {
      this.updatedProfile = {...this.userProfile};
      this.updatedProfile.lastUpdateTimeStamp = this.firestore.FieldValue.serverTimestamp();
    }
    // console.log('dhdhdhdhd', this.updatedProfile, this.sessionInfo)

  // this.auth.postAuthCheck(this.updatedProfile, this.id);

  }
  // get last sign in info
  async getLastSignInProfile(){
    const ret = await Storage.get({ key: 'userProfile' });
    // console.log("ret getLastSignInProfile", ret);
    const lastSigninUserProfile = ret.value && ret.value != 'undefined' ? JSON.parse(ret.value) : {};
    // console.log("getLastSignInProfile",lastSigninUserProfile, ret);
    let idx = this.allProfiles.findIndex(p=>p.data.subscriberId==lastSigninUserProfile.subscriberId);
    // console.log("idx getLastSignInProfile",lastSigninUserProfile, idx);
    if(idx!= -1){
      this.getUserProfile(idx);
    }
  }
  // get User profile
  getUserProfile(index){
    this.userProfile=this.allProfiles[index]?.data;
    this.id = this.allProfiles[index]?.id;
    // console.log("getUserProfile",this.userProfile,index);
    Storage.set({key: 'userProfile', value: JSON.stringify(this.userProfile)});
    this.session.getSessionInfo(this.userProfile.subscriberId);
    // this.userData = data.userData;
    // if userData is incomplete or Data does not exist activate edit mode
    // if(!this.updatedProfile){
      this.incompleteProfile();
    // }
  }

  // update profile data
  async onSubmit(){
    await this.user.updateProfile(this.id, this.updatedProfile);
    this.editProfile = false;
  }
  // skip profile update
  onSkip(){
    // if new user registred then save the data we received from provider
    if(!this.userProfile){
      this.onSubmit();
    }
    this.editProfile = false;
  }
  // toggle editmode
  toggleEditMode(){
    this.editProfile = !this.editProfile;
    if(this.editProfile && !this.updatedProfile && this.userProfile){
      this.updatedProfile = {...this.userProfile};
      this.updatedProfile.lastUpdateTimeStamp = this.firestore.FieldValue.serverTimestamp();
    }
  }

}
