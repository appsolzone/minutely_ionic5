import { appPages } from './../app-menu-pages';
import { PaypalService } from 'src/app/shared/paypal/paypal.service';
import { Router } from '@angular/router';
import { ComponentsService } from './../components/components.service';
import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { Subscriber } from '../../interface/subscriber';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {
  public appPages = appPages;
  public adminEmail: any;
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
                        picUrl: '',
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
    public paypal: PaypalService,
    public alertController: AlertController,


  ) {
    // TBA
  }



  getSubscriber(subscriberId: string){
    const queryObj = subscriberId ? [{field: 'subscriberId', operator: '==', value: subscriberId}] : [];
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.subscribers, queryObj);
  }
  updateSubscriber(docId: string, subscriber: Subscriber){
    return this.db.setDocument(this.db.allCollections.subscribers, docId, subscriber);
  }

  async checkOrg(org, userProfile){
    // compare the subscription end date with the server time to ensure subscription is valid
    const subscriptionEnd = new Date(org?.subscriptionEnd?.seconds ? org?.subscriptionEnd?.seconds*1000 : org?.subscriptionEnd.toMillis());
    const endDate =  new Date((org?.subscriptionEnd?.seconds ? org?.subscriptionEnd?.seconds*1000 : org?.subscriptionEnd.toMillis()) + (15 * 24 * 60 * 60 * 1000));
    const loginStart = await this.db.getServerTime(userProfile?.uid);
    const toDay = new Date(loginStart?.serverTime);
    const subsStatus = org?.subscriptionType.toUpperCase() == 'FREE' ?
                     'grace'
                     :
                     toDay > endDate ?
                     'renew'
                     :
                     (
                       endDate > toDay && subscriptionEnd < toDay ?
                       'grace'
                       :
                       'valid'
                     );
    let message: any = {title: '', body: ''};

    // check if there is any payment initiated which has not been updated due to any failure,
    // or any auto renewal payment received before proceeding further
    const isAutoRenewed = await this.paypal.checkPaypalPayment(org, userProfile);
    if (isAutoRenewed){
       // valid subscription
       return {subsStatus, userStatus: userProfile?.status, title: 'Welcome', body: 'Welcome back, ' + userProfile?.name };
    } else{
      this.adminEmail = org?.email;

      if (['valid', 'grace'].includes(subsStatus)){ // checking expiring date
         if (subsStatus == 'grace') {
           if (org.subscriptionType.toUpperCase() == 'FREE'){
             if (userProfile.role != 'ADMIN'){
               message = {title: 'Trial Period', body: 'Currently you are enjoying the FREE trial period. Please contact your admin to upgrade the subscription. Contact your admin at   ' + this.adminEmail};
             } else {
               message = {title: 'Trial Period', body: 'Currently you are enjoying the FREE trial period. Please upgrade the subscription from subscription panel.'};
             }
           } else {
             if (userProfile.role != 'ADMIN'){
               message = {title: 'Renew Subscription', body: 'Subscription has ended on ' + moment(subscriptionEnd).format('ll') + '. To continue , please contact your admin to renew the subscription. Contact your admin at   ' + this.adminEmail};
             } else {
               message = {title: org.subscriptionType.toUpperCase() == 'FREE' ? 'Upgrade Plan' : 'Renew Subscription',
                          body: 'Subscription has ended on ' + moment(subscriptionEnd).format('ll') + '. To continue , please renew the subscription from subscription Panel.'};
             }
           }
         } else {
           message = {subsStatus, userStatus: userProfile?.status, title: 'Welcome', body: 'Welcome back, ' + userProfile?.name };
           if (org.subscriptionType.toUpperCase() == 'FREE'){
             if (userProfile.role != 'ADMIN'){
               message.body += ' Currently you are enjoying the FREE trial. Please contact your admin ' + this.adminEmail + ' to upgrade the subscription.';
             } else {
               message.body += ' Currently you are enjoying the FREE trial. Please upgrade the subscription from subscription panel.';
             }
           }
         }
         return {subsStatus, ...message};
      } else { // Subscription expired need to prompt renew
        message = {
                    title: org.subscriptionType.toUpperCase() == 'FREE' ? 'Upgrade Plan' : 'Renew Subscription',
                    body: 'Your ' + (['Free', 'FREE'].includes(org.subscriptionType) ? 'trial period' : 'subscription') +
                          ' has ended on ' + moment(org.subscriptionEnd.seconds * 1000).format('ll') +
                          ', please ' + (userProfile.role == 'ADMIN' ? '' : ('request your system administrator ' + org.email + ' to ')) +
                          (['Free', 'FREE'].includes(org.subscriptionType) ? 'upgrade' : 'renew') +
                          ' the subscription now.'
                  };
        return {subsStatus, ...message};
      }
    }
  }

}
