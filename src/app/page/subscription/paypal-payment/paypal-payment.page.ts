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
  allProfiles: any[];
  userProfile: User;
  orgProfile: any;
  initiatedPaypalID:any;
  paypalElementRendered: boolean = false;
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
    this.componentService.showLoader();
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
      console.log("paypal-payment Session Subscription got", value);
      if(value == undefined || !value?.orgProfile ||
        (this?.orgProfile && value?.orgProfile?.subscriberId != this?.orgProfile?.subscriberId)
      ){
        this.subscriberChanged = true;
      }
      // Re populate the values as required
      this.allProfiles = value?.allProfiles;
      this.userProfile = value?.userProfile;
      this.orgProfile = value?.orgProfile;
    });
  }

  getSelectedPlan(){
    this.getSelectedPlanSubs$ = this.planService.choosePlan.subscribe(
       res=>{
         if(res){
         this.plan = res;
         // console.log("Choose Plan asdkfglaks",res);

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

}
