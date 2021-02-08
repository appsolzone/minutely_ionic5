import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { PlanService } from 'src/app/shared/plan/plan.service';
import { PaypalService } from 'src/app/shared/paypal/paypal.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {
  // observables
  sessionSubs$;
  paypalPlanStatussubs$;

  allPlans:any= [];
  signinUi: any;
  userData: any;
  id: string;
  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;
  orgPlan: any = null;
  status:boolean;
  currPlanActiveOrNot:boolean;
  constructor(
      private auth: AuthenticationService,
      private planService:PlanService,
      private paypal: PaypalService,
      private session:SessionService,
      private router:Router,
      private componentService:ComponentsService
  ) { }

  ngOnInit(){
    // get session info
    this.getSessionInfo();
    // get paypalPlanStatus
    this.getPaypalPlanStatus();

  }

  ionViewWillEnter(){
    if(!this.orgProfile || this.orgProfile==undefined){
      this.router.navigate(['profile']);
    }
  }

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
       console.log("Session Subscription got", value);
       // check if the orgprofile changed, we need check the status in paypal if org changed
       if(
         this.orgProfile?.subscriberType !== 'Free'
         && this.orgProfile?.subscriberId !== value?.orgProfile?.subscriberId
       ){
         // this.componentService.showLoader();
          this.currPlanActiveOrNot = undefined;
          this.paypal.getSubcriptionDetails(value?.orgProfile?.paypalId);
       }
       // Re populate the values as required
       this.userProfile = value?.userProfile;
       this.orgProfile = value?.orgProfile;
       this.orgPlan = value?.orgPlan;

       if(this.userProfile){
         // Nothing to do just display details
       } else {
         this.router.navigate(['profile']);
       }
     });
  }

  getPaypalPlanStatus(){
    this.paypalPlanStatussubs$ = this.paypal.currPlanActiveOrNot.subscribe(res=>{
        this.currPlanActiveOrNot = res;
        console.log("plan status",this.currPlanActiveOrNot);
        // this.componentService.hideLoader();
    });
  }

 upgradePlan(){
   this.router.navigateByUrl('subscription/choose-plan');
 }
 cancelPlan(){
   if(this.orgProfile?.paypalPlanId){
     this.paypal.cancelSubcription(this.orgProfile?.paypalId)
   }

 }
}
