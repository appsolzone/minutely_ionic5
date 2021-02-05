import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { User } from '../interface/user';
import { Subscriber } from '../interface/subscriber';
import { ManageuserService } from './manageuser.service';
import { SubscriberService } from './subscriber.service';




@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
    public db: DatabaseService,
    public user: ManageuserService,
    public subscriber: SubscriberService,
  ) {
    // TBA
  }

  registerSubscriber(uId:string, sId:string, companyName:string, address:string, name:string, email:string){
    // this.loader = true;
    // Create references to the SF doc.
    const subscriberRef = this.db.afs.firestore.collection(this.db.allCollections.subscribers).doc(sId);
    const userRef = this.db.afs.firestore.collection(this.db.allCollections.users).doc();
    const notificationRef = this.db.afs.firestore.collection(this.db.allCollections.notifications).doc(uId);
    const useruids = this.db.afs.firestore.collection(this.db.allCollections.useruids).doc(uId);

    return this.db.afs.firestore.runTransaction(transaction =>{
       return transaction.get(subscriberRef).then(subsDoc=>{
         if(subsDoc.exists){
           // raise alert it should fail as we are trying to add a new subscriber which already exists
           console.log("Unable to add new subscriber, another session working on the same subscriber Id",subsDoc.data());
           throw 'Unable to add new subscriber, another session working on the same Subscriber ID!';
         } else {
           // add user as part of the subscriber
           let newUser = Object.assign(
                                     {},
                                     {...this.user.newUser},
                                     {
                                       uid: uId,
                                       name: name,
                                       email: email,
                                       subscriberId: sId,
                                       address: address,
                                       role: 'ADMIN',
                                       status: 'ACTIVE'
                                     }
                                   );
           this.db.setTransactDocument(transaction, userRef, newUser);
           // add user to useruids list
           let newuseruids = {uid: uId,email: email};
           this.db.setTransactDocument(transaction, useruids, newuseruids);
           // create the notification area
           let newNotification = Object.assign(
                                     {},
                                     // {...this.subscriber.newSubscriber},
                                     {
                                       uid: uId,
                                       name: name,
                                       totalAlerts: 0,
                                       totalAlertsUnread: 0
                                     }
                                   );
           this.db.setTransactDocument(transaction, notificationRef, newNotification);
           // add subscriber document
           let newSubscriber = Object.assign(
                                     {},
                                     {...this.subscriber.newSubscriber},
                                     {companyName: companyName,subscriberId: sId,email: email, address: address}
                                   );
           this.db.setTransactDocument(transaction, subscriberRef, newSubscriber);
         }
       }); // end of transaction callback
    }); // end of runTransaction
  }

  joinSubscriber(uId:string, sId:string, name:string, email:string)
  {

      const subscriberRef = this.db.afs.firestore.collection(this.db.allCollections.subscribers).doc(sId);
      const userRef = this.db.afs.firestore.collection(this.db.allCollections.users).doc();
      const notificationRef = this.db.afs.firestore.collection(this.db.allCollections.notifications).doc(uId);
      const useruids = this.db.afs.firestore.collection(this.db.allCollections.useruids).doc(uId);

      return this.db.afs.firestore.runTransaction(transaction =>{
        return transaction.get(subscriberRef).then(subsDoc=>{
           // add user as part of the subscriber
           let newUser = Object.assign(
                                     {},
                                     {...this.user.newUser},
                                     {
                                       uid: uId,
                                       name: name,
                                       email: email,
                                       subscriberId: sId,
                                       // address: address,
                                       role: 'USER',
                                       status: 'REGISTERED'
                                     }
                                   );
           this.db.setTransactDocument(transaction, userRef, newUser);
           // add user to useruids list
           let newuseruids = {uid: uId,email: email};
           this.db.setTransactDocument(transaction, useruids, newuseruids);
           // create the notification area
           let newNotification = Object.assign(
                                     {},
                                     // {...this.subscriber.newSubscriber},
                                     {
                                       uid: uId,
                                       name: name,
                                       totalAlerts: 0,
                                       totalAlertsUnread: 0
                                     }
                                   );
           this.db.setTransactDocument(transaction, notificationRef, newNotification);

        }); // end of transaction callback
     }); // end of runTransaction
  }
}