import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { PlanService } from 'src/app/shared/plan/plan.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { Plugins } from '@capacitor/core';
import { ComponentsService } from 'src/app/shared/components/components.service';
const { Storage } = Plugins;
@Component({
  selector: 'app-choose-plan',
  templateUrl: './choose-plan.page.html',
  styleUrls: ['./choose-plan.page.scss'],
})
@Autounsubscribe()
export class ChoosePlanPage implements OnInit {
  // observables
  sessionSubs$;
  getauthStateSubs$;
  subscriberChanged: boolean = false;
  allPlans:any= [];
  generalPlans: any=[];
  orgProfile: any;
  constructor(
      private planService:PlanService,
      private session:SessionService,
      private router:Router,
      private componentService:ComponentsService
  ) { }

  async ngOnInit() {

     this.getSessionInfo();
     await this.fetchAllPlans();
  }

  ngOnDestroy(){

  }
  ionViewWillEnter(){
    if(this.subscriberChanged){
      this.router.navigate(['subscription']);
    }
  }

  getSessionInfo(){
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
       console.log("ChoosePlanPage Session Subscription got", value);
       // Re populate the values as required
       if(this.orgProfile
          && this.orgProfile.subscriberId != value?.orgProfile.subscriberId
        ){
          this.subscriberChanged = true;
        }

       this.orgProfile = value?.orgProfile;

       if(!this.orgProfile || !value){
         // no profile info so go back to profile to login
         this.router.navigate(['profile']);
       }
     });
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
      this.generalPlans = this.allPlans.filter(p=>p.planType=='general').sort((a,b)=>a.price-b.price);
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
