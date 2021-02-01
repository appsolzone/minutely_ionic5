import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Subscriber } from '../interface/subscriber';
@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor(
    public db: DatabaseService,
  ) {
    // TBA
  }
  getSubscriber(subscriberId:string){
    let queryObj = subscriberId ? [{field: 'subscriberId',operator: '==', value: subscriberId}] : [];
    return this.db.getAllDocumentsByQuery(this.db.allCollections.subscribers, queryObj);
  }
  updateSubscriber(docId:string, subscriber:Subscriber){
    return this.db.setDocument(this.db.allCollections.subscribers, docId, subscriber);
  }
}
