import { RegistrationService } from './../../shared/registration.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from '../../decorator/autounsubscribe';
import { Subscriber } from '../../interface/subscriber';
import { AuthenticationService } from '../../shared/authentication.service';
import { SubscriberService } from '../../shared/subscriber.service';


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
  public orgProfile: Subscriber;
  public subscriberType: string = "new";
  public subscriberExists: boolean = false;
  public alreadyJoined: boolean = false;
  firestore: any;

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private subscriber: SubscriberService,
    public register: RegistrationService
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
    if(this.orgProfile.subscriberId && this.orgProfile.subscriberId.trim()){
      this.alreadyJoined = this.allProfiles.filter(o=>o.data.subscriberId==this.orgProfile.subscriberId.trim().toUpperCase()).length != 0;
      if(this.alreadyJoined){
        this.subscriberExists = true;
      } else if(this.subscriberType=='existing' && this.subscriberExists){
        this.orgProfile = {...this.allSubData[0].data};
      } else {
        Object.assign(this.orgProfile ,{companyName: '', address: ''});
      }
    }
    // console.log("orgprofile",this.orgProfile,this.subscriberType);
  }

  authStateCallBack(data){
      if(data.userData){
        //console.log("if data.userData && this.userData", data.userData, this.userData);
        this.userData = data.userData;
        const {displayName, email, phoneNumber} = this.userData.providerData[0];
        this.orgProfile = {
          subscriberId: '',
          companyName: '',
          country: '',
          email: email,
          phoneNumber: phoneNumber,
          paypalId: '',
          noOfFreeLicense: 2,
          noOfUserAllowed: 3,
          address: '',
          companyLogo: '',
          tncVersion: 1,
          subscriptionType: 'Free',
          subscriptionStart: this.firestore.FieldValue.serverTimestamp(),
          subscriptionEnd: this.firestore.FieldValue.serverTimestamp(),
          lastUpdateTimeStamp: this.firestore.FieldValue.serverTimestamp(),
          enrollmentDate: this.firestore.FieldValue.serverTimestamp()
        };
      } else {
        // go back to manage profile
        this.router.navigate(['/tabs/profile']);
      }
  }

  ionInputSubscriberId(){
    this.subscriberExists = false;
    this.alreadyJoined = false;
    Object.assign(this.orgProfile ,{companyName: '', address: ''});
  }

  // check subscriber id
  async checkSubscriberId(e){
    console.log('subscriber',this.orgProfile.subscriberId);
    if(this.orgProfile.subscriberId && this.orgProfile.subscriberId.trim()){
      this.alreadyJoined = this.allProfiles.filter(o=>o.data.subscriberId==this.orgProfile.subscriberId?.trim().toUpperCase()).length != 0;
      if(this.getSubscriberSubs$?.unsubscribe){
        await this.getSubscriberSubs$.unsubscribe();
        console.log('unsubscribe subscriber',this.orgProfile.subscriberId, this.alreadyJoined);
      }
      // subscribe to check of available id
      if(!this.alreadyJoined){
        this. getSubscriberSubs$ = this.subscriber.getSubscriber(this.orgProfile.subscriberId.trim().toUpperCase())
          .subscribe((sub)=>{
            this.allSubData = sub.map((a: any) => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return {id, data};
            });
            this.subscriberExists = this.allSubData.length!=0;
            if(this.subscriberType=='existing' && this.subscriberExists){
              this.orgProfile = {...this.allSubData[0].data};
            } else {
              Object.assign(this.orgProfile ,{companyName: '', address: ''});
            }
          });
      } else {
        this.subscriberExists = true;
        Object.assign(this.orgProfile ,{companyName: '', address: ''});
      }
    }

  }
  submit(){
    if(this.subscriberType=='new'){

      if(this.orgProfile.subscriberId == ''
          || this.orgProfile.address == ''
          || this.orgProfile.companyName ==''
        ){
          console.log('cannnot submit, fill all the fields');
        }
      else{
        this.register.registerSubscriber(this.userData.uid,
          this.orgProfile.subscriberId.trim().toUpperCase(),
          this.orgProfile.companyName,
          this.orgProfile.address,
          this.userData.providerData[0].displayName,
          this.userData.providerData[0].email)
          .then(feedback=>{
            this.cancelAddSubscriber(false)
          }).catch(err=>{
            console.log('error', err);
          })
      }
    }
    else{

      this.register.joinSubscriber(this.userData.uid,
        this.orgProfile.subscriberId.trim().toUpperCase(),
        this.userData.providerData[0].displayName,
        this.userData.providerData[0].email)
        .then(feedback=>{
          this.cancelAddSubscriber(false)
        }).catch(err=>{
          console.log('error', err);
        })

      // console.log('join part');

    }
  }

}
