import { PaypalService } from 'src/app/shared/paypal/paypal.service';
import { Router } from '@angular/router';
import { ComponentsService } from './../components/components.service';
import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { Subscriber } from '../../interface/subscriber';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class SubscriberService {
  public newSubscriber = {
                        subscriberId: '',
                        companyName: '',
                        country: '',
                        email: '',
                        phoneNumber: '',
                        paypalId: '',
                        noOfFreeLicense: 2,
                        noOfUserAllowed: 3,
                        address: '',
                        companyLogo: '',
                        tncVersion: null,
                        subscriptionType: 'Free',
                        subscriptionStart: this.db.frb.firestore.FieldValue.serverTimestamp(),
                        subscriptionEnd: this.db.frb.firestore.FieldValue.serverTimestamp(),
                        lastUpdateTimeStamp: this.db.frb.firestore.FieldValue.serverTimestamp(),
                        enrollmentDate: this.db.frb.firestore.FieldValue.serverTimestamp(),
                      };

  constructor(
    public db: DatabaseService,
    public common: ComponentsService,
    public router: Router,
    public paypal: PaypalService
  ) {
    // TBA
  }
  getSubscriber(subscriberId:string){
    let queryObj = subscriberId ? [{field: 'subscriberId',operator: '==', value: subscriberId}] : [];
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.subscribers, queryObj);
  }
  updateSubscriber(docId:string, subscriber:Subscriber){
    return this.db.setDocument(this.db.allCollections.subscribers, docId, subscriber);
  }

  checkOrg(org, userprofile){

    return new Promise(async function(res,rej){

      // console.log('orgData', org);
      // console.log('userData', userprofile);

    const subscriptionEnd = new Date(org?.subscriptionEnd.toMillis());
    const endDate =  new Date(org?.subscriptionEnd.toMillis() + (15 * 24 * 60 * 60 * 1000));
    let loginStart = await this.db.getServerTime(userprofile?.uid);
    const toDay = new Date(loginStart?.serverTime);
    let subsStatus = toDay > endDate ?
                     'renew'
                     :
                     (
                       endDate > toDay && subscriptionEnd < toDay ?
                       'grace'
                       :
                       'valid'
                     );
    let message = {title:'',body:''};

    console.log('subsStatus', subsStatus);

     let isAutoRenewed = await this.paypal.checkPaypalPayment(org, userprofile);
    //  let isAutoRenewed = false;



     if(isAutoRenewed){
       // this.toUserDashBoard({user:userData, admin: comData});
       return res(true);
     } else{
       if(['valid','grace'].includes(subsStatus)){ // checking expiring date
         if(subsStatus=='grace') {
           if(org.subscriptionType == "FREE"){
             if(userprofile.role != "ADMIN"){
               message = {title:"Trial Period",body:"Currently you are enjoying the FREE trial period. Please contact your admin to upgrade the subscription. Contact your admin at   " + this.adminUser.email};
             } else {
               message = {title:"Trial Period",body:"Currently you are enjoying the FREE trial period. Please upgrade the subscription from Admin Panel."};
             }
           } else {
             if(userprofile.role != "ADMIN"){
               message = {title:"Renew Subscription",body:"Subscription has ended on " + moment(subscriptionEnd).format('ll') + ". To continue , please contact your admin to renew the subscription. Contact your admin at   " + this.adminUser.email};
             } else {
               message = {title:"Renew Subscription",body:"Subscription has ended on " + moment(subscriptionEnd).format('ll') + ". To continue , please renew the subscription from Admin Panel."};
             }
           }

           this.common.presentAlert('Warning',message.body)
           this.router.navigate(['profile']);

           // this.sfp.defaultAlert(message.title, message.body);

          //  console.log('message1', message);
          //  return rej(false);

         }

         return res(true);
         // this.toUserDashBoard({user: userData, admin: comData});
       } else {
         // this.loader = false;
        //  this.db.user.loginStarted = false;
         if(userprofile.role == "ADMIN"){
           // this.renewNow({'user': userprofile, 'org': org});
          //  console.log('reneeew');
          this.common.presentAlert('Error','subscription ended');

          this.router.navigate(['subscription']);

           return rej(false);
         }else{
           // this.loader = false;
           
           if(org.subscriptionType == "FREE"){
             message = {title:"Package expiry", body: "Free trial period has ended on " + moment(subscriptionEnd).format('ll') + ". To continue , please contact your admin to upgrade the subscription. Contact your admin   "  };
           } else {
             message = {title:"Package expiry", body: "Subscription has ended on " + moment(subscriptionEnd).format('ll') + ". To continue , please contact your admin to renew the subscription. Contact your admin  " };
           }
           // this.sfp.defaultAlert(message.title, message.body);
           this.common.presentAlert('Error',message.body)
           this.router.navigate(['subscription']);



          //  console.log('message2', message);

           return rej(false);

         }
       }
     }


    }.bind(this))
    }






    //--------------- add days 15 days --------------------
    addDays(date, days)
    {
      return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
    }
}
