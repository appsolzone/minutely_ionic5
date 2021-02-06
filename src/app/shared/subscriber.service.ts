import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Subscriber } from '../interface/subscriber';
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
}