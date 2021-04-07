import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { NotificationsService } from '../notifications/notifications.service'

@Injectable({
  providedIn: 'root'
})
export class ItemUpdatesService {

  constructor(
    private notification: NotificationsService
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
      case 'meetings':
        return this.getMeetingNotifications(eventInfo);
        break;
      // case 'tasks':
      //   return this.getTaskNotifications(eventInfo);
      //   break;
      // case 'issues':
      //   return this.getIssueNotifications(eventInfo);
      //   break;
      // case 'risks':
      //   return this.getRiskNotifications(eventInfo);
      //   break;
      // case 'broadcast':
      //   return this.getBroadcastNotifications(eventInfo);
      //   break;
    }
  }

  getMeetingsMessage(eventInfo: any,userEventType: any) {
    // eventInfo.data to include meeting start time, meeting end time
    let newMeetingStart = typeof eventInfo.data.meetingStart == 'string' ?  new Date(eventInfo.data.meetingStart) : eventInfo.data.meetingStart;
    let prevMeetingStart = typeof eventInfo.prevData.meetingStart == 'string' ?  new Date(eventInfo.prevData.meetingStart) : eventInfo.prevData.meetingStart;
    console.log("dates", eventInfo.data.meetingStart, newMeetingStart, eventInfo.prevData.meetingStart, prevMeetingStart, newMeetingStart != prevMeetingStart, newMeetingStart - prevMeetingStart)
    let message = '';
    if(userEventType=='add'){
      message = "You have been invited to meeting '" + eventInfo.data.meetingTitle +
                    "' to be held on " + moment.utc(newMeetingStart).format('MMM D, YYYY HH:mm') + " UTC "  +
                    " . For further details, please open the app and check the Meetings section.";

    } else if (userEventType=='update') {
      message = "The meeting details of '" + eventInfo.prevData.meetingTitle +
                    "' has been updated. ";
      message +=  newMeetingStart != prevMeetingStart ?
                 "The meeting is now rescheduled to be held on " + moment.utc(newMeetingStart).format('MMM D, YYYY HH:mm') + " UTC "  +
                    " ."
                  :
                 "";
      message += " For further details, please open the app and check the Meetings section.";
    } else if (userEventType=='assignowner'){
      message = "You have been requested to conduct the meeting '" + eventInfo.data.meetingTitle +
                    "' to be held on " + moment.utc(newMeetingStart).format('MMM D, YYYY HH:mm') + " UTC "  +
                    " by " + eventInfo.prevData.ownerId.name +
                    ". For further details, please open the app and check the Meetings section.";
    } else if (userEventType=='cancel'){
      message = "The meeting '" + eventInfo.data.meetingTitle +
                    "' scheduled for " + moment.utc(newMeetingStart).format('MMM D, YYYY HH:mm') + " UTC "  + ", has been cancelled. ";
      message += " For further details, please open the app and check the Meetings section.";
    }

    return message;

  }
  //
  // getTasksMessage(eventInfo: any,userEventType: any) {
  //   // eventInfo.data to include meeting start time, meeting end time
  //   let message = '';
  //   if(userEventType=='assignowner'){
  //     message = "Task '" + eventInfo.data.taskTitle +
  //                   "' has been assigned to you. For further details, please open the app and check the Tasks section.";
  //
  //   } else if (userEventType=='update') {
  //     message = "The task details of '" + eventInfo.data.taskTitle +
  //                   "' has been updated. For further details, please open the app and check the Meetings section.";
  //   }
  //
  //   return message;
  //
  // }
  //
  // getIssuesMessage(eventInfo: any,userEventType: any) {
  //   // eventInfo.data to include meeting start time, meeting end time
  //   let message = '';
  //   if(userEventType=='assignowner'){
  //     message = "Issue '" + eventInfo.data.issueTitle +
  //                   "' has been assigned to you. For further details, please open the app and check the Issues section.";
  //
  //   } else if (userEventType=='update') {
  //     message = "The issue details of '" + eventInfo.data.issueTitle +
  //                   "' has been updated. For further details, please open the app and check the Issues section.";
  //   }
  //
  //   return message;
  //
  // }
  //
  // getRisksMessage(eventInfo: any,userEventType: any) {
  //   // eventInfo.data to include meeting start time, meeting end time
  //   let message = '';
  //   if(userEventType=='assignowner'){
  //     message = "Risk '" + eventInfo.data.riskTitle +
  //                   "' has been assigned to you. For further details, please open the app and check the Risks section.";
  //
  //   } else if (userEventType=='update') {
  //     message = "The risk details of '" + eventInfo.data.riskTitle +
  //                   "' has been updated. For further details, please open the app and check the Risks section.";
  //   }
  //
  //   return message;
  //
  // }
  //
  //
  getMeetingNotifications(eventInfo)
  {
    let newNotifications = [];
    // create notification if the meetingowner changed
    if(eventInfo.eventType=='update' && eventInfo.data.ownerId.uid != eventInfo.prevData.ownerId.uid){
      let _newOwnerAlertObj=
        {
          ...this.notification.newNotification,
          msgBody: this.getMeetingsMessage(eventInfo,'assignowner'),
          msgTitle: eventInfo.data.meetingTitle ? eventInfo.data.meetingTitle : 'Meeting information',
          origin: {label: 'Meetings', icon: 'calendar', color: 'primary'},
          actions: [{text: 'clear', color: 'medium', href: 'clear'}],
          refData: {id: eventInfo.data.id}, // data required for any action or oter purpose
          subscriberId: eventInfo.data.subscriberId,
          user: {uid: eventInfo.data.ownerId.uid, email: eventInfo.data.ownerId.email, name: eventInfo.data.ownerId.name}

          // notificationref: eventInfo.data.ownerId.uid+'_' + eventInfo.data.subscriberId,
          // notificationTime: this.db.frb.firestore.FieldValue.serverTimestamp(),
          // msgBody: this.getMeetingsMessage(eventInfo,'assignowner'),
          // name:   eventInfo.data.ownerId.name,
          // Origin: eventInfo.origin,
          // docId:  eventInfo.data.id,
          // Actions: {Action1:'Dismiss',},
          // refValues:{ meetingId:eventInfo.data.id, title: eventInfo.data.meetingTitle, meetingStart: eventInfo.data.meetingStart },
          // sendEmailData: {userEventType: 'assignowner', ownerId : {...eventInfo.data.ownerId }, prevOwner: { ...eventInfo.prevData.ownerId }}
        };
        newNotifications.push(_newOwnerAlertObj);
    }
    // need to create notifications for each of the attendees
    eventInfo.data.attendeeList.forEach((mp)=>{
      if(mp.uid){
        // lets check whether the user is newly added or existing user
        let userEventType = 'add';
        if(eventInfo.eventType=='update' || eventInfo.eventType=='cancel'){
          let isExisting = eventInfo.prevData.attendeeList.findIndex((u,i)=>{ return u.uid == mp.uid}, mp);
          if(isExisting != -1){ userEventType = eventInfo.eventType;}
        }
        let _newAlertObj=
          {
            ...this.notification.newNotification,
            msgBody: this.getMeetingsMessage(eventInfo,userEventType),
            msgTitle: eventInfo.data.meetingTitle ? eventInfo.data.meetingTitle : 'Meeting information',
            origin: {label: 'Meetings', icon: 'calendar', color: 'primary'},
            actions: userEventType=="add" ?
                    [{text: 'open', color: 'primary', href: 'meeting/meeting-details/'+eventInfo.data.id}, {text: 'clear', color: 'medium', href: 'clear'}]
                    :
                    [{text: 'clear', color: 'medium', href: 'clear'}],
            refData: {id: eventInfo.data.id}, // data required for any action or oter purpose
            subscriberId: eventInfo.data.subscriberId,
            user: {uid: mp.uid, email: mp.email, name: mp.name}

            // notificationref: mp.uid+'_' + eventInfo.data.subscriberId,
            // notificationTime: this.db.frb.firestore.FieldValue.serverTimestamp(),
            // msgBody: this.getMeetingsMessage(eventInfo,userEventType),
            // name:   mp.name,
            // attendee: mp,
            // Origin: eventInfo.origin,
            // docId:  eventInfo.data.id,
            // Actions: userEventType=="add" ? {Action1:'Accept',Action2:'Decline'} : {Action1:'Dismiss',},
            // refValues:{ meetingId:eventInfo.data.id, title: eventInfo.data.meetingTitle , meetingStart: eventInfo.data.meetingStart},
            // sendEmailData: {userEventType, ownerId : {...eventInfo.data.ownerId }, attendee: { ...mp }}
          };
          newNotifications.push(_newAlertObj);
      }
    });

    return newNotifications;

  }
  //
  // getTaskNotifications(eventInfo)
  // {
  //   let newNotifications = [];
  //   // List of users to send notifications
  //   let taskFollowers = [];
  //   taskFollowers.push({taskOwner: true, ...eventInfo.data.taskOwner});
  //   if(eventInfo.eventType=='update' && eventInfo.updatedBy.uid != eventInfo.data.taskInitiator.uid){
  //     taskFollowers.push({taskOwner: false, ...eventInfo.data.taskInitiator});
  //   }
  //   // need to create notifications for each of the task followers
  //   taskFollowers.forEach((mp)=>{
  //     if(mp.uid){
  //       // lets check whether the user is newly added or existing user
  //       let userEventType = (mp.taskOwner && eventInfo.eventType=='add') ||
  //                           (mp.taskOwner && eventInfo.eventType=='update' && eventInfo.data.taskOwner.uid != eventInfo.prevData.taskOwner.uid)
  //                           ? 'assignowner' : 'update';
  //       let _newAlertObj=
  //         {
  //           notificationref: mp.uid+'_' + eventInfo.data.subscriberId,
  //           notificationTime: this.db.frb.firestore.FieldValue.serverTimestamp(),
  //           msgBody: this.getTasksMessage(eventInfo,userEventType),
  //           name:   mp.name,
  //           Origin: eventInfo.origin,
  //           docId:  eventInfo.data.id,
  //           Actions: {Action1:'Dismiss',},
  //           refValues:{ taskId: eventInfo.data.id, title:  eventInfo.data.taskTitle}
  //         };
  //         newNotifications.push(_newAlertObj);
  //     }
  //
  //   });
  //
  //   return newNotifications;
  //
  // }
  //
  // getIssueNotifications(eventInfo){
  //   let newNotifications = [];
  //   // List of users to send notifications
  //   let issueFollowers = [];
  //   issueFollowers.push({issueOwner: true, ...eventInfo.data.issueOwner});
  //   if(eventInfo.eventType=='update' && eventInfo.updatedBy.uid != eventInfo.data.issueInitiator.uid){
  //     issueFollowers.push({issueOwner: false, ...eventInfo.data.issueInitiator});
  //   }
  //   // need to create notifications for each of the task followers
  //   issueFollowers.forEach((mp)=>{
  //     if(mp.uid){
  //       // lets check whether the user is newly added or existing user
  //       let userEventType = (mp.issueOwner && eventInfo.eventType=='add') ||
  //                           (mp.issueOwner && eventInfo.eventType=='update' && eventInfo.data.issueOwner.uid != eventInfo.prevData.issueOwner.uid)
  //                           ? 'assignowner' : 'update';
  //       let _newAlertObj=
  //         {
  //           notificationref: mp.uid+'_' + eventInfo.data.subscriberId,
  //           notificationTime: this.db.frb.firestore.FieldValue.serverTimestamp(),
  //           msgBody: this.getIssuesMessage(eventInfo,userEventType),
  //           name:   mp.name,
  //           Origin: eventInfo.origin,
  //           docId:  eventInfo.data.id,
  //           Actions: {Action1:'Dismiss',},
  //           refValues:{ taskId: eventInfo.data.id, title:  eventInfo.data.issueTitle}
  //         };
  //         newNotifications.push(_newAlertObj);
  //     }
  //
  //   });
  //
  //   return newNotifications;
  //
  // }
  //
  // getRiskNotifications(eventInfo)
  // {
  //   let newNotifications = [];
  //   // List of users to send notifications
  //   let riskFollowers = [];
  //   riskFollowers.push({issueOwner: true, ...eventInfo.data.riskOwner});
  //   if(eventInfo.eventType=='update' && eventInfo.updatedBy.uid != eventInfo.data.riskInitiator.uid){
  //     riskFollowers.push({riskOwner: false, ...eventInfo.data.riskInitiator});
  //   }
  //   // need to create notifications for each of the task followers
  //   riskFollowers.forEach((mp)=>{
  //     if(mp.uid){
  //       // lets check whether the user is newly added or existing user
  //       let userEventType = (mp.riskOwner && eventInfo.eventType=='add') ||
  //                           (mp.riskOwner && eventInfo.eventType=='update' && eventInfo.data.riskOwner.uid != eventInfo.prevData.riskOwner.uid)
  //                           ? 'assignowner' : 'update';
  //       let _newAlertObj=
  //         {
  //           notificationref: mp.uid+'_' + eventInfo.data.subscriberId,
  //           notificationTime: this.db.frb.firestore.FieldValue.serverTimestamp(),
  //           msgBody: this.getRisksMessage(eventInfo,userEventType),
  //           name:   mp.name,
  //           Origin: eventInfo.origin,
  //           docId:  eventInfo.data.id,
  //           Actions: {Action1:'Dismiss',},
  //           refValues:{ riskId: eventInfo.data.id, title:  eventInfo.data.riskTitle}
  //         };
  //         newNotifications.push(_newAlertObj);
  //     }
  //
  //   });
  //
  //   return newNotifications;
  //
  // }
  //
  // recordMeetingResponse(notification: any,userData : any, response: any)
  // {
  //   // let meeting$ = this.db.afs.collection(this.db._COLL_MEETING).doc(notification.refValues.meetingId);
  //   let rlDocRef = this.db.afs.firestore.collection(this.db.allCollections.meeting).doc(notification.refValues.meetingId);
  //
  //   if(new Date(notification.refValues.meetingStart.seconds*1000) < new Date() && ["accept","decline"].includes(response))
  //     {
  //         this.componentService.presentAlert("Warning","Please note that this meeting is over. You cannot accept or reject a meeting of the past.");
  //         this.clearNotification(notification);
  //     }
  //     else
  //     {
  //       this.db.afs.firestore.runTransaction(function(transaction){
  //         // This code may get re-run multiple times if there are conflicts related to rlDocRef.
  //         return transaction.get(rlDocRef).then((doc)=>{
  //             if (doc.exists) {
  //               let meetingData = doc.data();
  //               let attendeeList=meetingData.attendeeList;
  //
  //               // Now check the attendee data and change it to
  //               let attendeePos = attendeeList.findIndex((u,i)=>u.uid==userData.uid,userData);
  //
  //               if(attendeePos != -1){
  //                 let attendee = attendeeList[attendeePos];
  //                 // change the acceptance to true
  //                 Object.assign(attendee,{accepted: response});
  //                 // now replace the array element with splice
  //                 attendeeList.splice(attendeePos,1,attendee);
  //
  //                 // Now update the document with merge option true as we only intend to update the attendeelist
  //
  //                 //transaction.update(rlDocRef, {attendeeList: attendeeList});
  //                 this.db.updateTransactDocument(rlDocRef, {attendeeList: attendeeList});
  //                 // So remove the notification
  //                 if(["accept","decline"].includes(response)){
  //                   // this.sfp.defaultAlert("Accept","Before adding to calendar.");
  //                   let calendarData = {
  //                     meetingEnd: meetingData.meetingEnd,
  //                     meetingStart: meetingData.meetingStart,
  //                     ...notification,
  //                   }
  //
  //                   if(response=="accept")
  //                   {
  //                     // this.addCalendarEvent(calendarData);
  //                     this.clearNotification(calendarData);
  //                   } else {
  //
  //                     // this.deleteCalendarEvent(calendarData);
  //                     this.clearNotification(calendarData);
  //                   }
  //
  //                 } else {
  //                   this.clearNotification(notification);
  //                 }
  //
  //               }
  //             } else {
  //                 // doc.data() will be undefined in this case
  //
  //                 this.clearNotification(notification);
  //             }
  //         });
  //     }.bind(this)).then(function(res){
  //         // Now safely delete the ference from the queue
  //
  //     }.bind(this)).catch(function(error){
  //
  //         this.sfp.defaultAlert("Fail","Unable to complete the request, please try again.");
  //     }.bind(this));
  //     }
  //
  // }

}
