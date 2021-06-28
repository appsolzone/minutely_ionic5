import { DatabaseService } from '../database/database.service';
import { Injectable } from '@angular/core';

import { ManageuserService } from '../manageuser/manageuser.service';
import { SubscriberService } from '../subscriber/subscriber.service';
import { KpiService } from '../kpi/kpi.service';




@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(
    public db: DatabaseService,
    public user: ManageuserService,
    public subscriber: SubscriberService,
    public aclKpiService: KpiService,
  ) {
    // TBA
  }

  registerSubscriber(
    uId: string,
    sId: string,
    companyName: string,
    address: string,
    name: string,
    email: string
  ) {
    // this.loader = true;
    // Create references to the SF doc.
    const subscriberRef = this.db.afs.firestore
      .collection(this.db.allCollections.subscribers)
      .doc(sId);
    const userRef = this.db.afs.firestore
      .collection(this.db.allCollections.users)
      .doc();
    const notificationRef = this.db.afs.firestore
      .collection(this.db.allCollections.notifications)
      .doc(uId);
    const useruids = this.db.afs.firestore
      .collection(this.db.allCollections.useruids)
      .doc(uId);
    const aclKpiRef = this.db.afs.firestore
      .collection(this.db.allCollections.aclKpi)
      .doc(sId);

    return this.db.afs.firestore.runTransaction((transaction) => {
      return transaction.get(subscriberRef).then((subsDoc) => {
        if (subsDoc.exists) {
          // raise alert it should fail as we are trying to add a new subscriber which already exists
          console.log(
            'Unable to add new subscriber, another session working on the same subscriber Id',
            subsDoc.data()
          );
          throw new Error('Unable to add new subscriber, another session working on the same Subscriber ID!');
        } else {
          // add user as part of the subscriber
          const newUser = Object.assign(
            {},
            { ...this.user.newUser },
            {
              uid: uId,
              name,
              email,
              subscriberId: sId,
              address,
              role: 'ADMIN',
              status: 'ACTIVE',
            }
          );
          this.db.setTransactDocument(transaction, userRef, newUser);
          // add user to useruids list
          const newuseruids = { uid: uId, email };
          this.db.setTransactDocument(transaction, useruids, newuseruids, true);
          // create the notification area
          const newNotification = Object.assign(
            {},
            // {...this.subscriber.newSubscriber},
            {
              uid: uId,
              name,
              totalAlerts: 0,
              totalAlertsUnread: 0,
            }
          );
          this.db.setTransactDocument(
            transaction,
            notificationRef,
            newNotification
          );
          // add subscriber document
          const newSubscriber = Object.assign(
            {},
            { ...this.subscriber.newSubscriber },
            {
              companyName,
              subscriberId: sId,
              email,
              address,
            }
          );
          this.db.setTransactDocument(
            transaction,
            subscriberRef,
            newSubscriber
          );

          // insert initial aclKpi object
          this.db.setTransactDocument(
            transaction,
            aclKpiRef,
            this.aclKpiService.kpiObject
          );
        }
      }); // end of transaction callback
    }); // end of runTransaction
  }

  joinSubscriber(
    uId: string,
    sId: string,
    name: string,
    email: string,
    userOnbordData: any = undefined
  ) {
    const subscriberRef = this.db.afs.firestore
      .collection(this.db.allCollections.subscribers)
      .doc(sId);
    const userRef = this.db.afs.firestore
      .collection(this.db.allCollections.users)
      .doc();
    const notificationRef = this.db.afs.firestore
      .collection(this.db.allCollections.notifications)
      .doc(uId);
    const useruids = this.db.afs.firestore
      .collection(this.db.allCollections.useruids)
      .doc(uId);

    return this.db.afs.firestore.runTransaction((transaction) => {
      return transaction.get(subscriberRef).then((subsDoc) => {
        let subscriber = subsDoc.data();
        if (subscriber.noOfFreeLicense<=0) {
          // raise alert it should fail as we are trying to add a new subscriber which already exists
          console.log(
            'Unable to add new user, please check the available no of free license and try again',
            subscriber
          );
          throw new Error('Unable to add new user, please check the available no of free license and try again!');
        } else {
          // add user as part of the subscriber
          const newUser = Object.assign(
            {},
            { ...this.user.newUser },
            {
              uid: uId,
              name,
              email,
              subscriberId: sId,
              // address: address,
              role: userOnbordData !== undefined ? userOnbordData.role : 'USER',
              status: userOnbordData !== undefined ? 'ACTIVE' : 'REGISTERED',
              jobTitle:
                userOnbordData !== undefined && userOnbordData?.jobTitle
                  ? userOnbordData?.jobTitle
                  : null,
              phoneNumber:
                userOnbordData !== undefined && userOnbordData?.phoneNumber
                  ? userOnbordData?.phoneNumber
                  : null,
            }
          );
          // during admin user onboard
          if (userOnbordData != undefined) {
            const subsUpdateObj = {
              noOfFreeLicense: this.db.frb.firestore.FieldValue.increment(-1),
            };
            this.db.setTransactDocument(
              transaction,
              subscriberRef,
              subsUpdateObj,
              true
            );
          }

          this.db.setTransactDocument(transaction, userRef, newUser);
          // add user to useruids list
          const newuseruids = { uid: uId, email };
          this.db.setTransactDocument(transaction, useruids, newuseruids, true);
          // create the notification area
          const newNotification = Object.assign(
            {},
            // {...this.subscriber.newSubscriber},
            {
              uid: uId,
              name,
              totalAlerts: 0,
              totalAlertsUnread: 0,
            }
          );
          this.db.setTransactDocument(
            transaction,
            notificationRef,
            newNotification
          );
        }
      }); // end of transaction callback
    }); // end of runTransaction
  }
}
