import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ComponentsService } from '../components/components.service';
import { DatabaseService } from '../database/database.service';
declare var paypal;

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  currPlanActiveOrNot = new BehaviorSubject<any|undefined>(undefined);
  initiatedPaypalID: string;

  constructor(
    public db: DatabaseService,
    private componentService:ComponentsService,
    private router:Router
  ) { }


  // render paypal button for the payment page
  renderPaypalButtons(plan,userProfile, orgProfile){
    const self = this;
    //------------------------------------
    //paypal button
      paypal
      .Buttons({
        createSubscription: function (data, actions) {
          return actions.subscription
            .create({
              plan_id: plan.paypalPlanId,
              // Quantity is now 1 as we are only buying a single plan with no of licences clubbed for a price tag
              quantity: 1, //self.planMin,
            })
            .then((val) => {
              //console.log(JSON.stringify(val));
              return self.storeInitalData(val, plan, userProfile, orgProfile).then((res) => {
                if (res == true) {
                  return val;
                }
              });
            });
        },
        onApprove: function (data, actions) {
          console.log("on Approve :", data);
          self.checkPreviousActivePlan(data, plan, userProfile, orgProfile);
        },
        onCancel: function (data) {
          // Show a cancel page, or return to cart
          self.componentService.presentAlert(
            "Error",
            "Paypal payment has been cancelled. Please try again.",
          );
          self.storeCancelRecord(data, plan, userProfile, orgProfile);
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
  }

  // check plan status
  async checkPreviousActivePlan(data, plan, userProfile, orgProfile){

     this.componentService.showLoader();
     let ref = {
       userProfile:userProfile,
       orgProfile:orgProfile,
       plan:plan,
     }
     await this.getSubcriptionDetails(this.initiatedPaypalID,ref);
  }

  storeInitalData(val, plan, userProfile, orgProfile){
    this.initiatedPaypalID = val;
    let objectPass = {
         initiated: val,
         oldValues: {
             noOfUserAllowed: orgProfile.noOfUserAllowed,
             subscriptionType: orgProfile.subscriptionType,
           },
         newValues: {
             noOfUserAllowed: plan.allowedLicense, //parseInt(a.quantity),
             subscriptionType: plan.planName,
           },
         initiator: {
             uid: userProfile.uid,
             name: userProfile.name,
             email: userProfile.email,
         },
         coupon: plan.coupon ? plan.coupon : null,
       }
    return this.storeCartInitalData(objectPass, orgProfile.subscriberId);
  }

   //-------------------- store cancel recored in transaction--------
   storeCancelRecord(data,plan,userProfile, orgProfile) {
     let transectionObj = {
       paymentStatus: "cancelled",
       timeStamp: new Date(),
       subscriberId: orgProfile.subscriberId,
       paypalId: this.initiatedPaypalID,
       oldValues: {
         noOfUserAllowed: orgProfile.noOfUserAllowed,
         subscriptionType: orgProfile.subscriptionType,
       },
       newValues: {
         noOfUserAllowed: plan.allowedLicense, //parseInt(a.quantity),
         subscriptionType: plan.planName,
       },
       initiator: {
             uid: userProfile.uid,
             name: userProfile.name,
             email: userProfile.email,
       },
     }
     let cartObj = {
         initiated: null
       }
     if(orgProfile.paypalIDHas)cartObj['cancelled'] = orgProfile.paypalId;
     this.storeCartCancelRecord(transectionObj,cartObj,orgProfile.subscriberId);
   }

   // =========Start Get Subcription Details Method=======================
    getSubcriptionDetails(paypalId,ref:any = null) {
     const self = this;
     const xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function () {
       if (this.readyState === 4 && this.status === 200) {
        let a = JSON.parse(this.responseText);
         console.log(this.responseText);
         let result = a.status === "ACTIVE" ? true : false;
         console.log('self.currPlanActiveOrNot',result);
         self.currPlanActiveOrNot.next(result);

         if(ref!==null){
           ref['newSubscription'] = a;
           if(ref.orgProfile.paypalId){self.cancelSubcription(ref.orgProfile.paypalId,ref)}
           else{
             self.batchPerform(ref);
           }
         }
         // let data = {currPlanActiveOrNot,...a};
         return self.currPlanActiveOrNot;
       } else {
         self.currPlanActiveOrNot.next(false);
         return self.currPlanActiveOrNot;
       }
     };
     xhttp.open("GET", environment.paypalInfo.paypalBillingUrl + paypalId, true);
     xhttp.setRequestHeader("Authorization", environment.paypalInfo.paypalBasicUrl);
     xhttp.send();
   }

   cancelSubcription(paypalId,ref:any = null) {
     const self = this;
     const xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function () {
       if (this.readyState === 4 && this.status === 204) {
         if(ref !== null){
           self.batchPerform(ref);
         }
         return true;
       }
     };
     xhttp.open(
       "POST",
       environment.paypalInfo.paypalBillingUrl + paypalId + "/cancel",
       true
     );
     xhttp.setRequestHeader("Authorization", environment.paypalInfo.paypalBasicUrl);
     xhttp.setRequestHeader("Content-Type", "Application/json");
     xhttp.send();
   }

  // ============Start Get getSubcriptionHistoryDetails Method========================
  getSubcriptionHistoryDetails(subcriptionId,date) {
     // console.log("UTC",moment.utc());
     // console.log("UTC 1",moment(date).format('YYYY-MM-DDTHH:mm'));
     // console.log("UTC 2",moment().format('YYYY-MM-DDTHH:mm'));
     const self = this;
     const xhttp = new XMLHttpRequest();
     const startTime = moment(date).format('YYYY-MM-DDTHH:mm');//2020-01-01T07:50:20.940Z;
     const endTime =moment().format('YYYY-MM-DDTHH:mm')  ;//2020-12-31T07:50:20.940Z;
     xhttp.onreadystatechange = function () {
       if (this.readyState === 4 && this.status === 200) {
         let a = JSON.parse(this.responseText);
         console.log(this.responseText);
       }
     };
     xhttp.open("GET", environment.paypalInfo.paypalBillingUrl + subcriptionId + "/transactions?start_time=" + startTime + "&end_time=" + endTime , true);
     xhttp.setRequestHeader("Authorization",environment.paypalInfo.paypalBasicUrl);
     xhttp.send();
   }
   // ============END Get Subcription Details Method========================

   async batchPerform(ref){
       let {userProfile,orgProfile,plan,newSubscription} = ref;
       //cart
       let cartObj = {
           initiated: null
         }
     if(orgProfile.paypalIDHas)cartObj['cancelled'] =orgProfile.paypalId;

       // transection
       let transectionObj = {
       paymentStatus: "success",
       timeStamp: new Date(newSubscription.status_update_time),
       subscriberId: orgProfile.subscriberId,
       paypalId: newSubscription.id,
       oldValues: {
         noOfUserAllowed: orgProfile.noOfUserAllowed,
         subscriptionType: orgProfile.subscriptionType,
       },
       newValues: {
         noOfUserAllowed: plan.allowedLicense, //parseInt(a.quantity),
         subscriptionType: plan.planName,
       },
       initiator: {
             uid: userProfile.uid,
             name: userProfile.name,
             email: userProfile.email,
       },
     }

     // Check graceperiod
     const subscriptionEnd = new Date(orgProfile.subscriptionEnd.toMillis());
     const endDate =  new Date(orgProfile.subscriptionEnd.toMillis() + (15 * 24 * 60 * 60 * 1000));
     let loginStart = await this.db.getServerTime(userProfile.uid);
     const toDay = new Date(loginStart.serverTime);
     let subsStatus = toDay > endDate ?
                       'renew'
                       :
                       (
                         endDate > toDay && subscriptionEnd < toDay ?
                         'grace'
                         :
                         'valid'
                       );
     //subscriber
     let subscriberObj = {
             subscriptionType: plan.planName,
             noOfUserAllowed: plan.allowedLicense, //parseInt(a.quantity),
             noOfFreeLicense:
               //parseInt(a.quantity) -
               plan.allowedLicense -
               orgProfile.noOfUserAllowed,
             subscriptionEnd: subsStatus=='grace' ?
                             this.addDays(subscriptionEnd, 30)
                             :
                             this.addDays(new Date(newSubscription.status_update_time), 30),
             paypalId: newSubscription.id,
             couponCode: plan.coupon && plan.coupon.couponCode ? plan.coupon.couponCode : '',
           }


         var batch = this.db.afs.firestore.batch();
         // cart collection
         const cart = this.db.afs.collection(this.db.allCollections.cart).doc(transectionObj.subscriberId)
           .ref;
           batch.set(cart, cartObj);
         //transactions collection
         const transactionsId = this.db.afs.createId();
         const transactions = this.db.afs
           .collection(this.db.allCollections.transactions)
           .doc(`${transactionsId}`).ref;
         batch.set(transactions, transectionObj);
         //subscriber collection
         const subscriber = this.db.afs
           .collection(this.db.allCollections.subscribers)
           .doc(`${transectionObj.subscriberId}`).ref;
         batch.update(subscriber, subscriberObj);
         // Now increase the count of reference for the coupon code
         if(plan.coupon && plan.coupon.couponCode){
           let couponRef = this.db.afs
             .collection(this.db.allCollections.coupons)
             .doc(plan.coupon.id).ref;
           batch.update(couponRef,{
             totalReferrals: this.db.frb.firestore.FieldValue.increment(1),
           });
         }
         batch
           .commit()
           .then((result) => {
             this.componentService.hideLoader();
             this.componentService.presentToaster('Successfull !! new subscription done')
             this.router.navigate(['subscription']);
           })
           .catch((err)=>{
             this.componentService.hideLoader();
             console.log("final plan batch fail",err)
           })
   }
   // add days 30 days
   addDays(date, days) {
     return new Date(
       moment(date.getTime() + days * 24 * 60 * 60 * 1000).format("YYYY-MM-DD")
     );
   }

   //=====record initial data =========
  storeCartInitalData(object,subscriberId){
    return this.db.setDocument(this.db.allCollections.cart,subscriberId,object)
      .then((result) => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
  //===========store cancel record==========
  storeCartCancelRecord(transObj,cartObj,sid){
    var batch = this.db.afs.firestore.batch();
    //  console.log("after cancel paypal", this.initiatedPaypalId);
    const transactionsId = this.db.afs.createId();
    const transactions = this.db
      .afs.collection(this.db.allCollections.transactions)
      .doc(`${transactionsId}`).ref;
    batch.set(transactions,transObj);
    // cart collection
    const cart = this.db.afs.collection(this.db.allCollections.cart).doc(sid)
      .ref;
      batch.set(cart,cartObj);
      batch.commit().then(res=>{console.log('storeCancelRecord batch success',res)})
      .catch(err=>{console.log('storeCancelRecord batch error',err)})
    }

    //===================== Arnab Mitra update====================/
    checkPaypalPayment(comData: any, userData: any)
    {
      let paypalId = comData?.paypalId;
      if(!paypalId || comData?.subscriptionType=='FREE')
      {
        return false;
      } else {
        return this.getPaypalStatus(paypalId)
          .then(async function(res){
  
            if(res.status === "ACTIVE" && new Date(res.billing_info.last_payment.time) > new Date(comData.subscriptionEnd.seconds*1000))
            {
              let isUpdated = await this.updateSubscriptionEnd(comData,res);
              return isUpdated;
            }
          }.bind(this));
      }
    }


    getPaypalStatus(paypalId)
    {
      const xhttp = new XMLHttpRequest();
      return new Promise((res, rej) => {
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            let a = JSON.parse(this.responseText);
            return res(a);
          }
        };
        xhttp.open("GET", environment.paypalInfo.paypalBillingUrl + paypalId, true);
        xhttp.setRequestHeader("Authorization", environment.paypalInfo.paypalBasicUrl);
  
        xhttp.send();
      });
    }
    updateSubscriptionEnd(comData: any,paypalRes)
    {
      return new Promise((result, rej) => {
        if (paypalRes.status === "ACTIVE") {
          // this.checkPayActive = true;
          let obj = {subscriptionEnd: this.addDays(new Date(comData.subscriptionEnd.seconds*1000), 31)}
          this.db.updateDocument(this.db.allCollections.subscribers, comData.subscriberId,obj)
          .then(() => {
              // this.checkPayActive = true;
              return result(true);

            })
            .catch((err) => {
              // this.checkPayActive = false;
              return result(false);
            });
        } else {
          return rej(false);
        }
      });
    }


}
