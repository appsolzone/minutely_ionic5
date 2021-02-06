import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { PlanService } from 'src/app/shared/plan.service';
import { SessionService } from 'src/app/shared/session.service';
import { Plugins } from '@capacitor/core';
import { ComponentsService } from 'src/app/shared/components/components.service';
const { Storage } = Plugins;
@Component({
  selector: 'app-choose-plan',
  templateUrl: './choose-plan.page.html',
  styleUrls: ['./choose-plan.page.scss'],
})
export class ChoosePlanPage implements OnInit {
  allPlans:any= [];
  getauthStateSubs$;
  signinUi: any;
  userData: any;
  id: string;
  allProfiles: any[];
  userProfile: User;
  orgProfile: any;
  constructor(
      private planService:PlanService,
      private session:SessionService,
      private router:Router,
      private componentService:ComponentsService
  ) { }

  async ngOnInit() {
   await this.session.watch().subscribe(value=>{
      console.log("Session Subscription got", value);
      // Re populate the values as required
      this.allProfiles = value?.allProfiles;
      this.orgProfile = value?.orgProfile;

      if(this.allProfiles && this.orgProfile && value){
        if(this.allProfiles.length==0){
          this.router.navigate(['profile']);
        } else if(this.allProfiles.length==1){
          this.getUserProfile(0);
        } else {
          this.getLastSignInProfile();
        }


      }else{
        this.router.navigate(['profile']);
      }
    });

     await this.fetchAllPlans();
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




  fetchAllPlans(){
    this.componentService.showLoader();
    this.allPlans = [];
    this.planService.getAllPlans().then(
      function(plans){
       let allplans = [];
       plans.forEach(function (plan:any){
       let id = plan.id;
       let data = plan.data();
       let planData = {id,...data};
       this.allPlans.push(planData);
       }.bind(this))
      this.componentService.hideLoader();
      }.bind(this)


    )

  }

  paymentPage(plan) {
    if (plan.planName !== "Free") {
      if(this.orgProfile.noOfUserAllowedHas - this.orgProfile.noOfFreeLicenseHas > plan.allowedLicense){
       this.componentService.presentAlert(`Error`,`Please note that there are ${this.orgProfile.noOfUserAllowedHas - this.orgProfile.noOfFreeLicenseHas} active users. Selected plan allows ${plan.allowedLicense} users. Please select a plan which supports at least ${this.orgProfile.noOfUserAllowedHas - this.orgProfile.noOfFreeLicenseHas} users.`)
      }
      else{
       this.planService.choosePlan.next(plan);
       this.router.navigateByUrl('subscription/payment');
      }
    }

    // else if (plan.planName === "Free" && this.navData.platform === 'web') {
    //      this.navCtrl.push(UserAdminPage, {
    //     'data': this.navData,
    //   });
    // }else if(plan.planName === "Free" && this.navData.platform === 'mobile'){
    //    this.navCtrl.push(LoginPage);
    // }else if(plan.planName === "Free" && this.navData.platform === 'newregistration'){
    //    this.navCtrl.push(LoginPage);
    // }
  }








}
