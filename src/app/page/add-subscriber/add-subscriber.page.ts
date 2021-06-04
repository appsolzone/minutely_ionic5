import { RegistrationService } from './../../shared/registration/registration.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from '../../decorator/autounsubscribe';
import { Subscriber } from '../../interface/subscriber';
import { AuthenticationService } from '../../shared/authentication/authentication.service';
import { SubscriberService } from '../../shared/subscriber/subscriber.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;


@Component({
  selector: 'app-add-subscriber',
  templateUrl: './add-subscriber.page.html',
  styleUrls: ['./add-subscriber.page.scss'],
})
@Autounsubscribe()
export class AddSubscriberPage implements OnInit {
  @Input() cancelAddSubscriber: any;
  @Input() allProfiles: any;
  // @Input() addSubscriber: any;
  // observable
  getSubscriberSubs$;
  getauthStateSubs$;
  public allSubData: any[];
  public userData: any;
  public maskedEmail: string;
  public orgProfile: Subscriber;
  public subscriberType = 'new';
  public subscriberExists = false;
  public alreadyJoined = false;
  public verifyEmail: string;
  public requiredEmailCheck = true;
  public subsriberIdContainsBlankSpace = false;
  firestore: any;

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private subscriber: SubscriberService,
    public register: RegistrationService,
    public componentService: ComponentsService,
    public sessionService: SessionService
  ) {
    this.firestore = this.subscriber.db.frb.firestore;
    this.getauthStateSubs$ = this.auth.authState(this.authStateCallBack.bind(this));

  }

  ngOnInit() {
  }

  ngOnDestroy(){

  }

  async signOut(){
    await this.auth.signOut();
  }
  segmentChanged(e){
    // this.subscriberType = e;
    if (this.orgProfile.subscriberId && this.orgProfile.subscriberId.trim()){
      this.alreadyJoined = this.allProfiles.filter(o => o.data.subscriberId == this.orgProfile.subscriberId.trim().toUpperCase()).length != 0;
      if (this.alreadyJoined){
        this.subscriberExists = true;
      } else if (this.subscriberType == 'existing' && this.subscriberExists){
        this.orgProfile = {...this.allSubData[0].data};
      } else {
        Object.assign(this.orgProfile , {companyName: '', address: ''});
      }
    } else{
      Object.assign(this.orgProfile , {companyName: '', address: ''});
    }
    // console.log("orgprofile",this.orgProfile,this.subscriberType);
  }

  authStateCallBack(data){
      if (data.userData){
        console.log('if data.userData && this.userData', data, data.userData);
        this.userData = data.userData;
        this.requiredEmailCheck = this.userData.providerData[0].providerId !== 'google.com';
        const regex = /.(?=[^@]*?@)/g; // /(?<=.{1}).(?=[^@]*?@)/g;
        const {displayName, email, phoneNumber} = this.userData.providerData[0];
        this.maskedEmail = email.replace(regex, '*');
        this.orgProfile = {
          subscriberId: '',
          companyName: '',
          country: '',
          email,
          phoneNumber,
          paypalId: '',
          noOfFreeLicense: 2,
          noOfUserAllowed: 3,
          address: '',
          picUrl: '',
          tncVersion: 1,
          subscriptionType: 'Free',
          subscriptionStart: this.firestore.FieldValue.serverTimestamp(),
          subscriptionEnd: this.firestore.FieldValue.serverTimestamp(),
          lastUpdateTimeStamp: this.firestore.FieldValue.serverTimestamp(),
          enrollmentDate: this.firestore.FieldValue.serverTimestamp()
        };
      } else {
        // go back to manage profile
        this.router.navigate(['profile']);
      }
  }
  ionInputVerifyEmail(){
    // TBA
  }

  checkVerifyEmail(e){
    // TBA
  }

  ionInputSubscriberId(){
    this.subscriberExists = false;
    this.alreadyJoined = false;
    // Object.assign(this.orgProfile , {companyName: '', address: ''});
  }

  // check subscriber id
  async checkSubscriberId(e){
    console.log('subscriber', this.orgProfile.subscriberId);
    // check whether it contains blank space
    if (this.orgProfile.subscriberId && this.orgProfile.subscriberId.trim()){
      this.subsriberIdContainsBlankSpace = this.orgProfile.subscriberId.trim().includes(' ');
    } else {
      this.subsriberIdContainsBlankSpace = false;
    }
    if (this.orgProfile.subscriberId && this.orgProfile.subscriberId.trim() && !this.subsriberIdContainsBlankSpace){
      this.alreadyJoined = this.allProfiles.filter(o => o.data.subscriberId == this.orgProfile.subscriberId?.trim().toUpperCase()).length != 0;
      if (this.getSubscriberSubs$?.unsubscribe){
        await this.getSubscriberSubs$.unsubscribe();
        console.log('unsubscribe subscriber', this.orgProfile.subscriberId, this.alreadyJoined);
      }
      // subscribe to check of available id
      if (!this.alreadyJoined){
        this. getSubscriberSubs$ = this.subscriber.getSubscriber(this.orgProfile.subscriberId.trim().toUpperCase())
          .subscribe((sub) => {
            this.allSubData = sub.map((a: any) => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return {id, data};
            });
            this.subscriberExists = this.allSubData.length != 0;
            if (this.subscriberType == 'existing' && this.subscriberExists){
              this.orgProfile = {...this.allSubData[0].data};
            } else {
              // Object.assign(this.orgProfile , {companyName: '', address: ''});
            }
          });
      } else {
        this.subscriberExists = true;
        // Object.assign(this.orgProfile , {companyName: '', address: ''});
      }
    }

  }
  async submit(){
    if (this.subscriberType == 'new'){

      if (this.orgProfile.subscriberId == ''
          || this.orgProfile.address == ''
          || this.orgProfile.companyName == ''
        ){
          this.componentService.presentAlert('Error', 'cannnot submit, fill all the fields');
          console.log('cannnot submit, fill all the fields');
        }
      else{
        await this.componentService.showLoader('Configuring details, please wait ....');
        this.register.registerSubscriber(this.userData.uid,
          this.orgProfile.subscriberId.trim().toUpperCase(),
          this.orgProfile.companyName,
          this.orgProfile.address,
          this.userData.providerData[0].displayName,
          this.userData.providerData[0].email)
          .then(async feedback => {
            // await this.sessionService.getProfiles(this.userData.uid);
            // await this.sessionService.getSubscriberProfile(this.orgProfile.subscriberId).then(()=>{
            // first clear last login info from storage
            // await Storage.remove({key: 'userProfile'});
            const userProfile = { subscriberId: this.orgProfile.subscriberId.trim().toUpperCase(), uid: this.userData.uid };
            await Storage.set({
              key: 'userProfile',
              value: JSON.stringify(userProfile),
            });
            this.componentService.hideLoader();
            this.componentService.presentToaster('Success!! Organization created successfully');
            this.router.navigate(['subscription/choose-plan'], {state: {data: {newsubscriber: this.orgProfile.subscriberId.trim().toUpperCase()}}});
            // });

            this.cancelAddSubscriber(false, true);
          }).catch(err => {
            this.componentService.hideLoader();
            console.log('error', err);
          });
      }
    }
    else{
      await this.componentService.showLoader();
      this.register.joinSubscriber(this.userData.uid,
        this.orgProfile.subscriberId.trim().toUpperCase(),
        this.userData.providerData[0].displayName,
        this.userData.providerData[0].email)
        .then(feedback => {
          this.componentService.hideLoader();
          this.cancelAddSubscriber(false);
        }).catch(err => {
          this.componentService.hideLoader();
          console.log('error', err);
        });

      // console.log('join part');

    }
  }

}
