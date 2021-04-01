import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { ComponentsService } from '../components/components.service';
import { DatabaseService } from '../database/database.service';
import { SendEmailService } from '../send-email/send-email.service';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private db:DatabaseService,
    private sendEmailService:SendEmailService,
    private componentService:ComponentsService
    // private sfp: SimpleFunctionsProvider,
    // private calendar: Calendar,
  ) { }



  getNotifications(eventInfo)
  {
    // triggering event info can be anything, but should include the following
    // origin: meetings, risks, issue, tasks
    // eventType: add, assignowner, update,
    // data: data related to the notification
    // prevData: for updates if required supply previous data
    switch(eventInfo.origin)
    {
      case 'broadcast':
        return this.getBroadcastNotifications(eventInfo);
        break;
    }
  }


  getBroadcastNotifications(eventInfo)
  {
    let newNotifications = [];

    let _newAlertObj=
          {
            //notificationref: eventInfo.data.id+'_' + eventInfo.data.subscriberId,
            notificationref: eventInfo.data.id,
            notificationTime: this.db.frb.firestore.FieldValue.serverTimestamp(),
            msgBody: eventInfo.broadcastMsg,
            name:   eventInfo.name,
            Origin: eventInfo.origin,
            docId:  '',
            Actions: {Action1:'Dismiss',},
            refValues:{ broadcastId: '', title:  eventInfo.title}
          };
          newNotifications.push(_newAlertObj);

    return newNotifications;
  }

  // Get the list of users for which the alerts to be created and create the required alerts
  createNotifications(eventInfo: any)
  {
    console.log("function is calling")
    let notifications = this.getNotifications(eventInfo);
    return new Promise((resolve: any, reject: any)=>{
      // initiate a btach
      let batch = this.db.afs.firestore.batch(); // initiate batch
      // Loop through the notifications to populate notifications
      notifications.forEach((msg)=>{
        // set the document for the item in concern
        let notificationid = eventInfo.data.id + moment.utc();
        let itemRef = this.db.afs.collection(this.db.allCollections.notifications)
                      .doc(msg.notificationref)
                      .collection(this.db.allCollections.latestAlert)
                      .doc(notificationid).ref;

        // Now remove notificationref from msg

        // Keeping this reference as this is required to get FCM device key
        // from users collection for the user
        // delete msg.notificationref;
        batch.set(itemRef,msg);
        if (eventInfo.origin === "meetings"){
          this.sendEmail(eventInfo, msg.sendEmailData, notificationid);
        }

      });

      batch.commit().then(()=>{

        resolve(true);
      }).catch(err =>{

        reject(err);
      });
    });
  }

  sendEmail(eventInfo: any, sendEmailData: any, notificationid: any) {
    if (eventInfo.origin === "meetings" && sendEmailData && sendEmailData.userEventType === "add") {
      // let uid_sid = sendEmailData.attendee.uid + "_" + eventInfo.data.subscriberId;
      let uid_sid = sendEmailData.attendee.uid;
        this.sendEmailService.sendCustomEmail(this.sendEmailService.newMeetingInviteMailPath, {
          toEmail: sendEmailData.attendee.email,
          toName: sendEmailData.attendee.name,
          initiator: eventInfo.data.ownerId.name,
          orgName: eventInfo.data.subscriberId,
          urlAccept: "https://ocurrenshub.firebaseapp.com/meeting-response/accept/" + notificationid + "/" + uid_sid,
          urlReject: "https://ocurrenshub.firebaseapp.com/meeting-response/reject/" + notificationid + "/" + uid_sid,
          urlTentative: "https://ocurrenshub.firebaseapp.com/meeting-response/tentative/" + notificationid + "/" + uid_sid,
          meetingTitle: eventInfo.data.meetingTitle,
          initationDate: moment.utc(eventInfo.data.meetingStart).format("MMM DD, YYYY h:mm a") + " UTC",
          targetCompletionDate: moment.utc(eventInfo.data.meetingEnd).format("MMM DD, YYYY h:mm a") + " UTC",
          status: eventInfo.data.status,
        }).then((sent: any)=>
        {

        });
    }
    else if (eventInfo.origin === "meetings" && sendEmailData && sendEmailData.userEventType === "update") {
      this.sendEmailService.sendCustomEmail(this.sendEmailService.updateMeetingMailPath,
        {
          toEmail:sendEmailData.attendee.email,
          toName: sendEmailData.attendee.name,
          initiator:eventInfo.data.ownerId.name,
          orgName:eventInfo.data.subscriberId,
          meetingTitle:eventInfo.data.meetingTitle,
          initationDate: moment.utc(eventInfo.data.meetingStart).format("MMM DD, YYYY h:mm a") + " UTC",
          targetCompletionDate: moment.utc(eventInfo.data.meetingEnd).format("MMM DD, YYYY h:mm a") + " UTC",
          status:eventInfo.data.status,
        }).then((sent: any)=>
        {

        });
    }
    else if (eventInfo.origin === "meetings" && sendEmailData && sendEmailData.userEventType === "assignowner") {
      this.sendEmailService.sendCustomEmail(this.sendEmailService.updateMeetingMailPath,
        {
          toEmail:sendEmailData.ownerId.email,
          toName: sendEmailData.ownerId.name,
          initiator:eventInfo.data.prevOwner.name,
          orgName:eventInfo.data.subscriberId,
          meetingTitle: eventInfo.data.meetingTitle + ' (assigned meeting owner)',
          initationDate: moment.utc(eventInfo.data.meetingStart).format("MMM DD, YYYY h:mm a") + " UTC",
          targetCompletionDate: moment.utc(eventInfo.data.meetingEnd).format("MMM DD, YYYY h:mm a") + " UTC",
          status:eventInfo.data.status,
        }).then((sent: any)=>
        {

        });
    }
  }

  clearNotification(notification)
  {
    // this.db.afs.collection(this.db.allCollections.notifications)
    //             .doc(notification.notificationref)
    //             .collection(this.db.allCollections.latestAlert)
    //             .doc(notification.id)
    //             .delete()
    this.db.deleteSubcollectionDocument(this.db.allCollections.notifications,
                                      notification.notificationref,
                                      this.db.allCollections.latestAlert,
                                      notification.id
                                      )
                .then((res)=>{
                  // Nothing pending ENJOY THE LIFE!!!!! PHEW!!!
                })
                .catch((err)=>{
                  this.componentService.presentAlert("Error","Unexpected error occured! Please try again.");
                });
  }
}
