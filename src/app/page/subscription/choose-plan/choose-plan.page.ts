import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { PlanService } from 'src/app/shared/plan/plan.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { Plugins } from '@capacitor/core';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { Platform } from '@ionic/angular';
import { CouponService } from 'src/app/shared/coupon/coupon.service';
const { Storage } = Plugins;
@Component({
  selector: 'app-choose-plan',
  templateUrl: './choose-plan.page.html',
  styleUrls: ['./choose-plan.page.scss'],
})
@Autounsubscribe()
export class ChoosePlanPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  // observables
  sessionSubs$;
  getauthStateSubs$;
  subscriberChanged: boolean = false;
  allPlans:any;
  generalPlans: any=[];
  orgProfile: any;
  uid: string;
  newsubscriber: string;
  //coupons
  allCoupons: any;
  haveCoupon: boolean = false;
  couponCode: string;
  constructor(
      private planService:PlanService,
      private session:SessionService,
      private router:Router,
      private componentService:ComponentsService,
      private couponService:CouponService,
      private platform:Platform
  ) { }

  ngOnInit() {
    let data = history.state.data;
    console.log("history data", data);
    if(data && data.newsubscriber){
      this.newsubscriber = data.newsubscriber;
    }
    // this.componentService.hideLoader();
    this.getSessionInfo();
    this.fetchAllPlans();
    this.fetchAllCoupons();
  }

  ngOnDestroy(){

  }
  async ionViewWillEnter(){
    console.log("ChoosePlanPage ionViewWillEnter Session", this.subscriberChanged);
    // if choose-plan is initiated from a new subscription
    let data = history.state.data;
    console.log("history data ionViewWillEnter", data);
    if(data && data.newsubscriber){
      await this.componentService.showLoader();
      this.subscriberChanged = false;
      this.orgProfile = undefined;
      this.newsubscriber = data.newsubscriber;
      if(this.sessionSubs$?.unsubscribe){
        // unsubscribe if already subscribed
        await this.sessionSubs$.unsubscribe();
      }
      this.getSessionInfo();

    } else if(this.subscriberChanged){
      this.subscriberChanged = false;
      // we received the data so unset the value here
      this.newsubscriber = undefined;
      // subscriber changed but no new subscription so back to subscription page
      this.router.navigate(['subscription']);
    }
  }

  getSessionInfo(){
    console.log("ChoosePlanPage getSessionInfo Session", this.subscriberChanged);
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
       console.log("ChoosePlanPage Session Subscription got", value, this.newsubscriber);
       // Re populate the values as required
       if(this.orgProfile
          && this.orgProfile?.subscriberId != value?.orgProfile?.subscriberId
        ){
          this.subscriberChanged = true;
        }

       if(!this.newsubscriber){
         this.orgProfile = value?.orgProfile;
       } else if(!this.orgProfile && this.newsubscriber && this.newsubscriber == value?.orgProfile?.subscriberId){
         this.orgProfile = value?.orgProfile;
       }
       this.uid = value?.uid;

       if(this.newsubscriber && this.newsubscriber != this.orgProfile?.subscriberId) {
         console.log("ChoosePlanPage Session Subscription got matched newsubscriber", value, this.newsubscriber);
         // till we get the new user profile as part of the session$.allProfiles data
         let userProfile = value?.allProfiles.filter(p=>p.data.uid==this.uid && p.data.subscriberId==this.newsubscriber);
         if(userProfile.length > 0){
           console.log("getUserProfile",userProfile[0], this.allPlans);
           Storage.set({key: 'userProfile', value: JSON.stringify(userProfile[0].data)});
           this.session.getSessionInfo(this.newsubscriber);
           console.log("ChoosePlanPage Session Subscription got matched newsubscriber allPlans", this.allPlans, this.newsubscriber);
           if(this.allPlans){
              console.log("Now hide loader");
             setTimeout(()=>this.componentService.hideLoader(),250);
           }
         }
       } else if(!this.orgProfile || !value){
         // no profile info so go back to profile to login
         this.router.navigate(['profile']);
       }
     });
  }

  fetchAllPlans(){
    this.componentService.showLoader();
    this.planService.getAllPlans().then( plans=>{
      this.allPlans = [];
      plans.forEach(p=>{
        console.log("response from Plans", p.id, p.data());
        let id = p.id;
        let data = p.data();
        this.allPlans.push({id,...data});
      });
      console.log("fetch all plans",this.allPlans,this.newsubscriber , this.orgProfile?.subscriberId);
      this.generalPlans = this.allPlans.filter(p=>p.planType=='general' && p.status==true && p.planName!='Free').sort((a,b)=>a.price-b.price);
      if(!this.newsubscriber || (this.newsubscriber && this.newsubscriber == this.orgProfile?.subscriberId)){
        console.log("hide loader now");
        setTimeout(()=>this.componentService.hideLoader(),250);
      }
    });

  }

  paymentPage(plan) {
    if (plan.planName !== "Free") {
      if(this.orgProfile.noOfUserAllowed - this.orgProfile.noOfFreeLicense > plan.allowedLicense){
       this.componentService.presentAlert(`Error`,`Please note that there are ${this.orgProfile.noOfUserAllowed - this.orgProfile.noOfFreeLicense} active users. Selected plan allows ${plan.allowedLicense} users. Please select a plan which supports at least ${this.orgProfile.noOfUserAllowed - this.orgProfile.noOfFreeLicense} users.`)
      }
      else{
       this.planService.choosePlan.next(plan);
       this.router.navigateByUrl('subscription/payment');
        // if (plan.planName === "Free" && this.platform == 'web') {
        // }else if(plan.planName === "Free" && this.platform == 'mobile'){
        // }else if(plan.planName === "Free" && this.platform == 'newregistration'){
        // }
      }
    }
  }




    //=========[ coupon ]============

    clickCoupon(){
    this.haveCoupon = true;
    // this.fetchAllCoupons();
    }
    cancelCoupon(){
    this.haveCoupon = false;
    this.couponCode = '';
    }
    fetchAllCoupons(){
      this.allCoupons = [];
      this.couponService.fetchAllCoupon().then(res=>{
         res.forEach(coupon=>{
           let data = coupon.data();
           let id = coupon.id;
           this.allCoupons.push({id,...data})
         })
      })
    }
   applyCoupon(){
    this.couponService.applyCoupon(this.couponCode,this.allCoupons,this.allPlans);
   }

   scrollToBottom(){
    this.content.scrollToBottom(500);
  }


}
