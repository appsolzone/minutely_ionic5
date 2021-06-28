import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { PlanService } from 'src/app/shared/plan/plan.service';
import { PaypalService } from 'src/app/shared/paypal/paypal.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { Plugins } from '@capacitor/core';
import { DatabaseService } from 'src/app/shared/database/database.service';
import * as moment from 'moment';
const { Storage } = Plugins;
declare var paypal;
@Component({
  selector: 'app-paypal-payment',
  templateUrl: './paypal-payment.page.html',
  styleUrls: ['./paypal-payment.page.scss'],
})
@Autounsubscribe()
export class PaypalPaymentPage implements OnInit {
 @ViewChild("paypal") paypalElement: ElementRef;
  // observables
  sessionSubs$;
  getSelectedPlanSubs$;
  subscriberChanged: boolean = false;
  planId: string = "";
  plan:any = null;
  id: string;
  sessionInfo: any;
  allProfiles: any[];
  userProfile: User;
  orgProfile: any;
  initiatedPaypalID:any;
  paypalElementRendered: boolean = false;
  validSubscription: boolean = false;
  subscripTionAlertMsg: string[]= [];
  constructor(
    private planService:PlanService,
    private paypal: PaypalService,
    private router:Router,
    private session:SessionService,
    private componentService:ComponentsService,
    private db:DatabaseService
  ) {
    // subscribe session data
    this.getSessionInfo();
    // subscribe choose plan data
    this.getSelectedPlan();


  }

  ngOnInit(){
   // await this.componentService.showLoader();
  }

  ngOnDestroy(){

  }
  ionViewWillEnter(){
    console.log("paypal-payment ionViewWillEnter Session Subscription got", this.subscriberChanged, this.sessionSubs$, this?.orgProfile);
    if(this.subscriberChanged){
       this.subscriberChanged = false;
       this.componentService.hideLoader();
       this.router.navigate(['subscription']);
    }
  }

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      console.log("paypal-payment getSessionInfo Session Subscription got", value);
      if(value == undefined || !value?.orgProfile ||
        (this?.orgProfile && value?.orgProfile?.subscriberId != this?.orgProfile?.subscriberId)
      ){
        this.subscriberChanged = true;
      }
      // Re populate the values as required
      this.sessionInfo = value;
      this.allProfiles = value?.allProfiles;
      this.userProfile = value?.userProfile;
      this.orgProfile = value?.orgProfile;
      // if plan has been selected
      if(this.plan && this.orgProfile){
        this.plan.allowedLicense = this.orgProfile.noOfUserAllowed
      }
    });
  }

  getSelectedPlan(){
    this.getSelectedPlanSubs$ = this.planService.choosePlan.subscribe(
       res=>{
         if(res){
         this.plan = res;
          console.log("Choose Plan asdkfglaks",res);
          // if plan has been selected
          if(this.plan && this.orgProfile){
            this.plan.allowedLicense = this.orgProfile.noOfUserAllowed;
          }

         }else{
           this.router.navigate(['subscription/choose-plan'])
         }
       }
     );
  }

  ionViewDidEnter() {

    if(!this.paypalElementRendered){

      // this.planService.renderPaypalButtons(self);
      this.paypal.renderPaypalButtons(this.plan,
                                      this.userProfile,
                                      this.orgProfile
                                    );
        // .render(this.paypalElement.nativeElement);
      // },1000);
      this.paypalElementRendered=true;
      this.componentService.hideLoader();
    }

  }

  checkSubscriptionValidity(){
    // Implement the checks for valid subscription
    // no of user => should be greater than the no of active users at present
    // free limits check based on the count we have per user basis
    this.subscripTionAlertMsg =[];
    let validSubscriptionUser = (this.orgProfile.noOfUserAllowed - this.orgProfile.noOfFreeLicense <= this.plan.allowedLicense);
    if(!validSubscriptionUser || !this.plan.allowedLicense){
      this.subscripTionAlertMsg.push("Please note that there are " + (this.orgProfile.noOfUserAllowed - this.orgProfile.noOfFreeLicense) +
                                  " active users. The no of users selected now is " + this.plan.allowedLicense +
                                  ". Please select at least " + (this.orgProfile.noOfUserAllowed - this.orgProfile.noOfFreeLicense) +
                                  " users.");
    }
    // Now check the limit
    let validFreeLimit = true;
    if(this.plan?.planFreeLimit && this.plan.allowedLicense){
      const {aclFreeLimitKpi} = this.sessionInfo;
      Object.keys(this.plan.planFreeLimit).forEach(featureId=>{
        let feature = aclFreeLimitKpi[featureId];
        let planLimit = this.plan.planFreeLimit[featureId];
        const freeLimit = planLimit?.freeLimit ?  planLimit?.freeLimit * this.plan.allowedLicense : -1;
        const usedLimit = feature?.usedLimit ?  feature?.usedLimit : 0;
        const isWithinLimit = freeLimit==-1 ? true : freeLimit >= usedLimit;
        console.log("isWithinKpiAclLimit", featureId, isWithinLimit, feature, planLimit);
        if(!isWithinLimit){
          this.subscripTionAlertMsg.push("Current usage (" + usedLimit + ") exceeds for " + planLimit.featureName + " for selected no of users against the plan (" + freeLimit + ")");
          validFreeLimit = false;
        }
      })
    }


    this.validSubscription = validSubscriptionUser && validFreeLimit;
  }

}
