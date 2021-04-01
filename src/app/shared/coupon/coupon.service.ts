import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentsService } from '../components/components.service';
import { DatabaseService } from '../database/database.service';
import { PlanService } from '../plan/plan.service';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(
    private db:DatabaseService,
    private componentService:ComponentsService,
    private planService:PlanService,
    private router:Router
  ) { }

  //fetch All coupon
   fetchAllCoupon(){
     return this.db.getAllDocuments(this.db.allCollections.coupons);
   }
    //apply a coupon code
    applyCoupon(couponCode,allCoupons,allPlans){
    // to be added
    // NOTE: Apply coupon is only avalable for new onboarding of user
    // step 1.check whether coupon is valid status==true, if not valid raise alert else proceed to step 2
    let coupon = allCoupons.filter(c=>c.couponCode==couponCode);
    if(coupon.length==0){
      this.componentService.presentAlert("Error","Please note that the coupon code " + couponCode + " is not valid. Please check and try again");
    } else if(coupon.length>1){
      this.componentService.presentAlert("Error","Please note that the coupon code " + couponCode + " is not valid. Please check with coupon code provider and get a valid coupon code.");
    }else{
      // step 2. Get the plan info check whether plan is type=='coupon' and still valid, if not valid raise alert else go to step 3
      //console.log("allplans", this.allPlans);
      let plan = allPlans.filter(p=>p.planName==coupon[0].planName && p.status===true && p.planType=='coupon');
      if(plan.length==0){
        this.componentService.presentAlert("Error","Unfortuantely related plan information is not available for the coupon code " + couponCode + ". Please check with coupon code provider and get a valid coupon code.");
      } else if(plan.length>1){
        this.componentService.presentAlert("Error","Unfortuantely related plan information is not valid for the coupon code " + couponCode + ". Please check with coupon code provider and get a valid coupon code.");
      } else {
      // step 3. call subscribe with the plan data we received in step 2
      plan[0].coupon = coupon[0];
      // this.planDataChanges(plan[0]);
       this.planService.choosePlan.next(plan[0]);
       this.router.navigateByUrl('subscription/payment');
      }
    }
   }
}
