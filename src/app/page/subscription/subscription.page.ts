import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { PlanService } from 'src/app/shared/plan.service';
import { SessionService } from 'src/app/shared/session.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {
  allPlans:any= [];
  getauthStateSubs$;
  signinUi: any;
  userData: any;
  id: string;
  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;
  status:boolean;
  currPlanActiveOrNot:boolean;
  constructor(
      private auth: AuthenticationService,
      private planService:PlanService,
      private session:SessionService,
      private router:Router,
      private componentService:ComponentsService
  ) { }

  async ngOnInit(){

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

    if(this.orgProfile.subscriberType !== 'Free'){
    // this.componentService.showLoader();
     await this.planService.getSubcriptionDetails(this.orgProfile.paypalId);
     this.planService.currPlanActiveOrNot.subscribe(res=>{
         this.currPlanActiveOrNot = res;
         console.log("plan status",this.currPlanActiveOrNot);
         // this.componentService.hideLoader();
     });
    }


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
 upgradePlan(){
   this.router.navigateByUrl('subscription/choose-plan');
 }
}
