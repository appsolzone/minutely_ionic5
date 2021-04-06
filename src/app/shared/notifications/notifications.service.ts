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
    origin: {label: '', icon: '', color: ''},
    actions: [{text: 'clear', color: 'medium', href: 'clear'}],
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
    return new Promise(async (resolve: any, reject: any)=>{
      // initiate a btach
      let batch = this.db.afs.firestore.batch(); // initiate batch
      // Loop through the notifications to populate notifications
      await notifications.forEach(async (msg)=>{
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

  broadcastNotifications(msg: any, sessionInfo: any, listofUsers: any[]=[])
  {
    let newNotifications = [];
    let {subscriberId} = sessionInfo;

    let _newAlertObj: any=
          {
            ...this.newNotification,
            msgBody: msg.msgBody,
            msgTitle: msg.msgTitle ? msg.msgTitle : 'Boradcast message',
            origin: {label: 'Broadcasts', icon: 'megaphone', color: 'secondary'},
            actions: [{text: 'clear', color: 'medium', href: 'clear'}],
            refData: {}, // data required for any action or oter purpose
            subscriberId: subscriberId,
            user: {uid: '', email: '', name: ''}
          };
    newNotifications = listofUsers.map(u=>{
      return {..._newAlertObj, user:{uid: u.uid, email: u.email, name: u.name} }
    });

    this.createNotifications(newNotifications);
    return {status: 'success', title: 'Broadcast messge', body: 'Message has been successfully broadcasted for the selected people.'}
  }
}
