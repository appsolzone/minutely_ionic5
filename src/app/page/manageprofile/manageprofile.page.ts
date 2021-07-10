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
import { Platform } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import '@codetrix-studio/capacitor-google-auth';
import { KpiService } from 'src/app/shared/kpi/kpi.service';
// import { AccessDeniedPage } from 'src/app/page/access-denied/access-denied/access-denied.page';

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
  editProfile = false;
  updatedProfile: User;
  addSubscriber = false;
  emailRegex =
    '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$';
  firestore: any;
  sessionInfo: any;
  subscriberId: any;
  newsubscriber = false;
  photo: SafeResourceUrl;
  public base64Image: string;
  public isMobile = false;
  public postLoginStarted = false;
  public signInFeatures = [
    {
      icon: 'today-outline',
      title: 'Meetings Simplified',
      details: [
        'Setup meetings',
        'Notify attendees',
        'Stay on top of your schedule'
      ]
    },
    {
      icon: 'mic-outline',
      title: 'Speech Recognition',
      details: [
        'Speech to text',
        'Edit or add texts effeortlessly',
        'Tap on the mic to start'
      ]
    },
    {
      icon: 'people-outline',
      title: 'Collaborate',
      details: [
        'Create Tasks, Issues and Risks',
        'Track each of these items',
        'Collaborate and record feedbacks'
      ]
    },
    {
      icon: 'library-outline',
      title: 'All In One Place',
      details: [
        'No items go out of your radar',
        'Create linkage across items',
        'Manage and share details with stakeholders'
      ]
    },
    {
      icon: 'rocket-outline',
      title: 'Boost Productivity',
      details: [
        'Be on top of actions',
        'Make your meetings effective and productive',
        'Stats and info just a tap away'
      ]
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      details: [
        'Get notified anytime, anywhere',
        'Be on top of your actionables',
        'Broadcast and share messages'
      ]
    },
    {
      icon: 'search-outline',
      title: 'Powerful Search',
      details: [
        'Powerful search engine',
        'Search by name, keyword, date etc',
        'Access details from search results'
      ]
    },
  ];
  public slideOpts = {
    initialSlide: Math.floor(Math.random() * this.signInFeatures.length), //0,
    slidesPerView: 1,
    autoplay:true
  };

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private user: ManageuserService,
    private session: SessionService,
    private database: DatabaseService,
    private subscriber: SubscriberService,
    private sanitizer: DomSanitizer,
    private common: ComponentsService,
    private upload: UploadImageService,
    private platform: Platform,
    private aclKpi: KpiService
  ) {
    this.isMobile =
      this.platform.is('mobile') && !this.platform.is('mobileweb');
    this.firestore = this.user.db.frb.firestore;
    this.getauthStateSubs$ = this.auth.authState(
      this.authStateCallBack.bind(this)
    );
    this.session.watch().subscribe((value) => {
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      let permissionKeys = value?.permissions ? Object.keys(value?.permissions.features) : [];
      const roleStatusChanged =
        !value ||
        this.sessionInfo?.userProfile?.status != value?.userProfile?.status ||
        this.sessionInfo?.userProfile?.role != value?.userProfile?.role;
      const permissionChanged = (value?.permissions && permissionKeys.some(featureId => {
            console.log("checking permissions", featureId, value?.permissions?.features[featureId]?.access, this.sessionInfo?.permissions?.features[featureId]?.access)
            return value?.permissions?.features[featureId]?.access != this.sessionInfo?.permissions?.features[featureId]?.access;
          })
        )
      console.log("permission changed",permissionChanged);
      const subscriberChanged =
        !value ||
        this.sessionInfo?.userProfile?.subscriberId !=
          value?.userProfile?.subscriberId ||
        this.sessionInfo?.orgProfile?.subscriptionType !=
          value?.orgProfile?.subscriptionType ||
        this.sessionInfo?.orgProfile?.subscriptionEnd?.seconds !=
          value?.orgProfile?.subscriptionEnd?.seconds;
      console.log(
        'performPostLoginChecks session watch roleStatusChanged',
        roleStatusChanged,
        subscriberChanged,
        value,
        this.sessionInfo?.orgProfile?.subscriptionEnd?.seconds,
          value?.orgProfile?.subscriptionEnd?.seconds
      );
      this.sessionInfo = value;
      this.allProfiles = value?.allProfiles;
      if (this.allProfiles) {
        if (this.allProfiles.length == 0) {
          this.addSubscriber = true;
        } else if (this.allProfiles.length == 1) {
          this.getUserProfile(0);
        } else {
          this.getLastSignInProfile();
        }
      }
      // console.log("subscription end check", this.sessionInfo?.orgProfile?.subscriptionEnd);
      // console.log("userProfile status check", this.sessionInfo?.userProfile?.status);
      // console.log('check_user',this.sessionInfo?.orgProfile,this.sessionInfo?.userProfile )
      if (
        (this.sessionInfo &&
          this.sessionInfo.userProfile &&
          this.sessionInfo.orgProfile &&
          this.sessionInfo?.userProfile?.subscriberId ==
            this.sessionInfo?.orgProfile?.subscriberId &&
          roleStatusChanged) ||
        (this.sessionInfo &&
          this.sessionInfo.userProfile &&
          this.sessionInfo.orgProfile &&
          subscriberChanged) ||
        (
          this.sessionInfo &&
          this.sessionInfo.userProfile &&
          this.sessionInfo.orgProfile &&
          this.sessionInfo?.userProfile?.subscriberId ==
            this.sessionInfo?.orgProfile?.subscriberId &&
          this.sessionInfo?.userProfile?.role ==
            value?.userProfile?.role &&
          permissionChanged
        )
      ) {

        console.log('performPostLoginChecks session watch');
        if(!this.postLoginStarted) this.performPostLoginChecks();
      }
    });
  }

  async performPostLoginChecks() {
    this.postLoginStarted = true;
    // await this.common.showLoader('Checking details, please wait...');
    // first check whether the user is active or not
    let validationResponse: any = {};
    validationResponse = this.user.checkUser(this.sessionInfo?.userProfile);
    if (validationResponse.userStatus == 'ACTIVE') {
      // since the user is active, perform subscription validation
      validationResponse = await this.subscriber.checkOrg(
        this.sessionInfo?.orgProfile,
        this.sessionInfo?.userProfile
      );
      console.log('validationResponse', validationResponse);
      this.renewNow(
        this.sessionInfo?.userProfile,
        this.sessionInfo?.orgProfile,
        validationResponse
      );
    } else {
      const { title, body } = validationResponse;
      const buttons: any[] = [
        {
          text: 'Dismiss',
          role: 'cancel',
          cssClass: '',
          handler: () => {},
        },
      ];
      await this.common.presentAlert(title, body, buttons);
      // should we signout the user or redirect for select profile
      // this.signOut();
      this.userProfile = null;
      this.appPages.forEach((p) => (p.disabled = !['profile'].includes(p.tab)));
      this.addSubscriber = false;
      // hide loader manually before navigating to another route
      this.common.hideLoader();
      this.postLoginStarted = false;
      this.router.navigate(['profile']);
    }
    // hide the loader now
    // setTimeout(() => this.common.hideLoader(), 100);
    this.common.hideLoader();
    this.postLoginStarted = false;
  }

  ngOnInit() {
    // this.common.presentModal(AccessDeniedPage);
  }

  async renewNow(userProfile, org, instruction: any = null) {
    console.log('my_org', org);
    const buttons: any[] = [
      {
        text: 'Dismiss',
        role: 'cancel',
        cssClass: '',
        handler: () => this.onDismissClick(instruction),
      },
    ];
    if (userProfile.role == 'ADMIN' && instruction.subsStatus != 'valid' && !this.newsubscriber) {
      buttons.push({
        text: ['Free', 'FREE'].includes(org.subscriptionType)
          ? 'Upgrade'
          : 'Renew',
        role: '',
        cssClass: 'alert-button-selected',
        handler: () => this.onUpgradeClick(instruction),
      });
    }
    if (
      (instruction.subsStatus == 'valid' &&
      instruction.userStatus == 'ACTIVE' ) ||
      this.newsubscriber
    ) {
      // if everything is fine just go to activity page directly
      this.onDismissClick(instruction);
    } else if(this.sessionInfo?.orgProfile?.subscriptionType.toUpperCase() == 'FREE'){
      this.common.presentToaster(instruction.body);
      this.onDismissClick(instruction);
    } else {
      await this.common.presentAlert(
        instruction.title,
        instruction.body,
        buttons
      );
    }
    this.newsubscriber = false;
    this.common.hideLoader();
  }

  onDismissClick(instruction) {
    // console.log('Confirm Cancel: blah');
    if (instruction.subsStatus != 'renew') {
      // So enable all the menu items for navigation
      this.appPages.forEach((p) => (p.disabled = false));
      if (!this.newsubscriber){
        // hide loader before navigating to another route
        this.postLoginStarted = false;
        this.common.hideLoader();
        // set the new session value as we received all session
        Storage.set({
          key: 'sessionInfo',
          value: JSON.stringify(this.sessionInfo),
        });
        // this.common.dismissModal();
        this.router.navigate([this.appPages[0].url]);
      }
      // hide loader before navigating to another route
      this.postLoginStarted = false;
      this.common.hideLoader();
    } else {
      // should we signout the user or redirect for select profile
      // this.signOut();
      // this.userProfile = null;
      this.addSubscriber = false;
      this.appPages.forEach(
        (p) => (p.disabled = !['profile', 'subscription'].includes(p.tab))
      );
      // if (this.newsubscriber){
        // hide loader before navigating to another route
        this.postLoginStarted = false;
        this.common.hideLoader();
        this.router.navigate(['profile']);
      // }
      // hide loader before navigating to another route
      this.postLoginStarted = false;
      this.common.hideLoader();
    }
    this.newsubscriber = false;
  }

  onUpgradeClick(instruction) {
    this.onDismissClick(instruction);
    // this.appPages.forEach(
    //   (p) => (p.disabled = !["profile", "subscription"].includes(p.tab))
    // );
    // hide loader before navigating to another route
    this.postLoginStarted = false;
    this.common.hideLoader();
    this.router.navigate(['subscription']);
  }

  takePhoto() {
    const source = {
      collection: this.database.allCollections.users,
      location: 'profileImages',
      document: this.sessionInfo?.userProfileDocId,
    };
    console.log('id', this.sessionInfo?.userProfileDocId);

    this.upload.takePhoto(source);
  }

  async signOut() {
    // await this.common.showLoader("Please wait... signout");
    await Storage.remove({ key: 'sessionInfo' });
    if (this.isMobile) {
      await Plugins.GoogleAuth.signOut();
    }
    await this.auth.signOut();
    this.sessionInfo = null;
    this.appPages.forEach((p) => (p.disabled = !['profile'].includes(p.tab)));
    this.session.clear();
    // this.common.hideLoader();
    this.common.presentToaster(
      'Signed out successfully. Please sign in again to continue.'
    );
  }
  // cancel add subscriber
  cancelAddSubscriber(checkProfiles: boolean = true, newsubscriber: boolean = false) {
    if (checkProfiles && this.allProfiles.length == 0) {
      this.signOut();
      this.addSubscriber = false;
    } else {
      this.addSubscriber = false;
    }
    this.newsubscriber = newsubscriber;
  }

  async authStateCallBack(data) {
    // setTimeout(()=>{
    // this.signinUi = data.signinUi;
    // if we are receiving the data for the first time
    if (data.userData && !this.userData) {
      //// console.log("if data.userData && this.userData", data.userData, this.userData);
      this.userData = data.userData;
      const ret = await Storage.get({ key: 'sessionInfo' });
      const lastSessionInfo =
        ret.value && ret.value != 'undefined' ? JSON.parse(ret.value) : {};
      console.log("setLastSessionInfo 0", lastSessionInfo?.orgProfile)
      this.session.setLastSessionInfo({...lastSessionInfo, source: 'localstorage'});
      console.log("setLastSessionInfo", lastSessionInfo?.orgProfile)
      // alert("Goto home page")
      // this.common.dismissModal();
      this.router.navigate([this.appPages[0].url]);
      this.session.getProfiles(this.userData.uid, this.userData);
    } else if (data.userData && this.userData) {
      //// console.log("else if", data.userData, this.userData);
      this.userData = data.userData;
      // if userData is incomplete or Data does not exist activate edit mode
      this.incompleteProfile();
    } else {
      this.editProfile = false;
      this.userProfile = undefined;
      this.id = undefined;
      this.userData = data.userData;
      this.updatedProfile = undefined;
    }
    this.postLoginStarted = false;
    this.common.hideLoader();
  }

  incompleteProfile() {
    // if userData is incomplete or Data does not exist activate edit mode
    if (
      this.userData &&
      (!this.userProfile ||
        !this.userProfile.name ||
        !this.userProfile.phoneNumber ||
        !this.userProfile.address ||
        !this.userProfile.jobTitle)
    ) {
      this.editProfile = true;
      // create a copy of the data, NOTE its a shallow copy!!!
      if (this.userProfile) {
        this.updatedProfile = { ...this.userProfile };
        this.updatedProfile.lastUpdateTimeStamp =
          this.firestore.FieldValue.serverTimestamp();
      } else {
        const { displayName, email, phoneNumber } =
          this.userData.providerData[0];
        this.id = this.userData.uid;
        this.updatedProfile = {
          uid: this.userData.uid,
          subscriberId: '',
          name: displayName,
          email,
          phoneNumber: phoneNumber ? phoneNumber : '',
          role: 'USER',
          jobTitle: '',
          address: '',
          status: 'CREATED',
          lastUpdateTimeStamp: this.firestore.FieldValue.serverTimestamp(),
          userCreationTimeStamp: this.firestore.FieldValue.serverTimestamp(),
        };
      }
    } else {
      this.updatedProfile = { ...this.userProfile };
      this.updatedProfile.lastUpdateTimeStamp =
        this.firestore.FieldValue.serverTimestamp();
    }
    // console.log('dhdhdhdhd', this.updatedProfile, this.sessionInfo)

    // this.auth.postAuthCheck(this.updatedProfile, this.id);
  }
  // get last sign in info
  async getLastSignInProfile() {
    console.log('idx getLastSignInProfile this.allProfiles', this.allProfiles);
    const ret = await Storage.get({ key: 'sessionInfo' });
    // console.log("ret getLastSignInProfile", ret);
    const lastSessionInfo =
      ret.value && ret.value != 'undefined' ? JSON.parse(ret.value) : {};
    const lastSigninUserProfile = lastSessionInfo.userProfile ? lastSessionInfo.userProfile : {};
    console.log("getLastSignInProfile",lastSessionInfo);
    const idx = this.allProfiles.findIndex(
      (p) => p.data.subscriberId == lastSigninUserProfile.subscriberId
    );
    console.log('idx getLastSignInProfile', lastSigninUserProfile, idx);
    if (idx != -1) {
      this.getUserProfile(idx);
    }
  }
  // get User profile
  getUserProfile(index) {
    this.userProfile = this.allProfiles[index]?.data;
    this.id = this.allProfiles[index]?.id;
    const sessionInfo = { uid: this.userProfile.uid, userProfileDocId: this.id, userProfile: this.userProfile };
    console.log('getUserProfileArnsb', this.userProfile, index);
    Storage.set({
      key: 'sessionInfo',
      value: JSON.stringify(sessionInfo),
    });
    this.session.getSessionInfo(this.userProfile.subscriberId);
    // this.userData = data.userData;
    // if userData is incomplete or Data does not exist activate edit mode
    // if(!this.updatedProfile){
    this.incompleteProfile();
    // }
  }

  // update profile data
  async onSubmit() {
    await this.common.showLoader('Saving profile data, please wait...');
    await this.user.updateProfile(this.id, this.updatedProfile);
    this.editProfile = false;
    // hide the loader now
    this.postLoginStarted = false;
    setTimeout(() => this.common.hideLoader(), 100);
  }
  // skip profile update
  onSkip() {
    // if new user registred then save the data we received from provider
    if (!this.userProfile) {
      this.onSubmit();
    }
    this.editProfile = false;
  }
  // toggle editmode
  toggleEditMode() {
    this.editProfile = !this.editProfile;
    if (this.editProfile && !this.updatedProfile && this.userProfile) {
      this.updatedProfile = { ...this.userProfile };
      this.updatedProfile.lastUpdateTimeStamp =
        this.firestore.FieldValue.serverTimestamp();
    }
  }
}
