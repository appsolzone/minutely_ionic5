import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Notification } from 'src/app/interface/notification';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public newNotification: Notification = {
    createdAt: this.db.frb.firestore.FieldValue.serverTimestamp(),
    msgBody: '',
    msgTitle: '',
    origin: {label: '', icon: ''},
    actions: {action1:'Dismiss',},
    refData: {}, // data required for any action or oter purpose
    subscriberId: '',
    user: {uid: '', email: '', name: ''}
  };

  constructor(
    private db:DatabaseService,
  ) { }

  getNotifications(queryObj:any[], textSearchObj: any = null, limit: any=null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.notifications, queryObj, textSearchObj, limit);
  }

  // Get the list of users for which the alerts to be created and create the required alerts
  createNotifications(notifications: any[]=[])
  {
    console.log("function is calling")
    return new Promise((resolve: any, reject: any)=>{
      // initiate a btach
      let batch = this.db.afs.firestore.batch(); // initiate batch
      // Loop through the notifications to populate notifications
      notifications.forEach(async (msg)=>{
        // set the document for the item in concern
        let notificationItem = await this.db.generateDocuemnetRef(this.db.allCollections.notifications);
        batch.set(notificationItem.ref,msg);
      });

      batch.commit().then(()=>{

        resolve(true);
      }).catch(err =>{

        reject(err);
      });
    });
  }

  clearNotification(notification)
  {
    this.db.deleteDocument(this.db.allCollections.notifications, notification.id);
  }

  getBroadcastNotifications(msg: any, sessionInfo: any, listofUsers: any[]=[])
  {
    let newNotifications = [];
    let {subscriberId} = sessionInfo;

    let _newAlertObj: any=
          {
            ...this.newNotification,
            msgBody: msg,
            msgTitle: 'Boradcast message',
            origin: {label: 'broadcasts', icon: 'megaphone'},
            actions: {action1:'Dismiss',},
            refData: {}, // data required for any action or oter purpose
            subscriberId: subscriberId,
            user: {uid: '', email: '', name: ''}
          };
    newNotifications = listofUsers.map(u=>{
      return {..._newAlertObj, user:{uid: u.uid, email: u.email, name: u.name} }
    });

    return newNotifications;
  }
}
