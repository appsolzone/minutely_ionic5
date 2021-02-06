import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { PlanService } from 'src/app/shared/plan.service';
import { SessionService } from 'src/app/shared/session.service';
import { Plugins } from '@capacitor/core';
import { DatabaseService } from 'src/app/shared/database.service';
import * as moment from 'moment';
const { Storage } = Plugins;
declare var paypal;
@Component({
  selector: 'app-paypal-payment',
  templateUrl: './paypal-payment.page.html',
  styleUrls: ['./paypal-payment.page.scss'],
})
export class PaypalPaymentPage implements OnInit {
 @ViewChild("paypal") paypalElement: ElementRef;
  planId: string = "";
  plan:any = null;
  getauthStateSubs$;

  id: string;
  allProfiles: any[];
  userProfile: User;
  orgProfile: any;
  initiatedPaypalID:any;
  constructor(
    private planService:PlanService,
    private router:Router,
    private session:SessionService,
    private componentService:ComponentsService,
    private db:DatabaseService
  ) { }

  async ngOnInit() {
     this.planService.choosePlan.subscribe(
      res=>{
        if(res){
        this.plan = res;
        console.log("Choose Plan asdkfglaks",res);

        }else{
          this.router.navigate(['subscription/choose-plan'])
        }
      }
    )

    this.session.watch().subscribe(value=>{
      console.log("Session Subscription got", value);
      // Re populate the values as required
      this.allProfiles = value?.allProfiles;
      this.orgProfile = value?.orgProfile;

      if(this.allProfiles){
        if(this.allProfiles.length==0){
          this.router.navigate(['profile']);
        } else if(this.allProfiles.length==1){
          this.getUserProfile(0);
        } else {
          this.getLastSignInProfile();
        }
      }
    });


    //------------------------------------
    const self = this;

    //------------------------------------
    //paypal button
    paypal
      .Buttons({
        createSubscription: function (data, actions) {
          return actions.subscription
            .create({
              plan_id: self.plan.paypalPlanId,
              // Quantity is now 1 as we are only buying a single plan with no of licences clubbed for a price tag
              quantity: 1, //self.planMin,
            })
            .then((val) => {
              //console.log(JSON.stringify(val));
              return self.storeInitalData(val).then((res) => {
                if (res == true) {
                  return val;
                }
              });
            });
        },
        onApprove: function (data, actions) {
          console.log("on Approve :", data);
          //self.planService.getSubcriptionDetails(data.subscriptionID);
          self.checkPreviousActivePlan(data);
        },
        onCancel: function (data) {
          // Show a cancel page, or return to cart
          self.componentService.presentAlert(
            "Error",
            "Paypal payment has been cancelled. Please try again.",
          );
          self.storeCancelRecord(data);
        },
        onError: function (err) {
          // Show an error page here, when an error occurs
           self.componentService.presentAlert(
            "Error",
            "Unfortunately something went wrong and we are not able to process the transaction. Please try again.",

          );
          console.log(err);
        },
      })
      .render(document.getElementById("paypal"));
      // .render(this.paypalElement.nativeElement);
  }


   
    // get last sign in info
  async getLastSignInProfile(){
    const ret = await Storage.get({ key: 'userProfile' });
    const lastSigninUserProfile = ret.value && ret.value != 'undefined' ? JSON.parse(ret.value) : {};
    let idx = this.allProfiles.findIndex(p=>p.data.subscriberId==lastSigninUserProfile.subscriberId);
    if(idx!= -1){
      this.getUserProfile(idx);
    }
  }
  // get User profile
  getUserProfile(index){
    this.userProfile=this.allProfiles[index]?.data;
    this.id = this.allProfiles[index]?.id;
    this.session.getSessionInfo(this.userProfile.subscriberId);
  }


 async checkPreviousActivePlan(data){ 
  let a = null; 
  this.componentService.showLoader(); 
  let ref = {
    userProfile:this.userProfile,
    orgProfile:this.orgProfile,
    plan:this.plan,
  }
  await this.planService.getSubcriptionDetails(this.initiatedPaypalID,ref);
 }

 storeInitalData(val){
   this.initiatedPaypalID = val;
   let objectPass = {
        initiated: val,
        oldValues: {
            noOfUserAllowed: this.orgProfile.noOfUserAllowed,
            subscriptionType: this.orgProfile.subscriptionType,
          },
        newValues: {
            noOfUserAllowed: this.plan.allowedLicense, //parseInt(a.quantity),
            subscriptionType: this.plan.planName,
          },
        initiator: {
            uid: this.userProfile.uid,
            name: this.userProfile.name,
            email: this.userProfile.email,
        },
        coupon: this.plan.coupon ? this.plan.coupon : null,
      }
   return this.planService.storeInitalData(objectPass,this.orgProfile.subscriberId);   
 }

  //-------------------- store cancel recored in transaction--------
  storeCancelRecord(data) {
    let transectionObj = {
      paymentStatus: "cancelled",
      timeStamp: new Date(),
      subscriberId: this.orgProfile.subscriberId,
      paypalId: this.initiatedPaypalID,
      oldValues: {
        noOfUserAllowed: this.orgProfile.noOfUserAllowed,
        subscriptionType: this.orgProfile.subscriptionType,
      },
      newValues: {
        noOfUserAllowed: this.plan.allowedLicense, //parseInt(a.quantity),
        subscriptionType: this.plan.planName,
      },
      initiator: {
            uid: this.userProfile.uid,
            name: this.userProfile.name,
            email: this.userProfile.email,
      },
    }
    let cartObj = {
        initiated: null
      }
    if(this.orgProfile.paypalIDHas)cartObj['cancelled'] = this.orgProfile.paypalId; 
    this.planService.storeCancelRecord(transectionObj,cartObj,this.orgProfile.subscriberId);
  }



backChoosePlan(){
  this.router.navigate(['subscription/choose-plan']);
}

}

