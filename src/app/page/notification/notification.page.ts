import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
@Autounsubscribe()
export class NotificationPage implements OnInit {
  // observables
  sessionSubs$;
  notificationSubs$;
  public sessionInfo: any;
  public allAlerts: any[];
  public notificationTypes: any[] = [];
  public alertSummary: any = {
     icon: 'notifications',
     title: 'Notifications summary',
     maxValue: 1,
     data: [
        // {icon: 'body', label: 'Tasks completion', labelValue: averageResolutionTask.toFixed(1), stack: [{cssClass: 'green', width: (averageResolutionTask*100/maxValueOfX), height: 1}]},
        // {icon: 'flag', label: 'Risks resolution', labelValue: averageResolutionRisk.toFixed(1), stack: [{cssClass: 'warning', width: (averageResolutionRisk*100/maxValueOfX), height: 1}]},
        // {icon: 'options', label: 'Issues resolution', labelValue: averageResolutionIssue.toFixed(1), stack: [{cssClass: 'danger', width: (averageResolutionIssue*100/maxValueOfX), height: 1}]}
      ],
  };;

  public allTexts = [
    {text: 'Notified for updates across items'},
    {text: 'Seemlessly Communicate with your team or individual team member'},
    {text: 'Broadcast messages for the targetted group'}
  ];
  constructor(
    private router: Router,
    private session: SessionService,
    private notification: NotificationsService
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {}
  ngOnDestroy() {}

  getSessionInfo(){
   this.sessionSubs$ = this.session.watch().subscribe(value=>{
      console.log("Session Subscription got", value);

      // Re populate the values as required
      this.sessionInfo = value;


      if(this.sessionInfo){
        // Nothing to do just display details
        if(this.sessionInfo?.userProfile){
          this.getNotifications();
        }
      } else {
         this.router.navigate(['profile']);
      }
    });
 }

 getNotifications(){
   const { subscriberId, uid } = this.sessionInfo.userProfile;
   let queryObj = [{field: 'subscriberId',operator: '==', value: subscriberId},
                   {field: 'user.uid',operator: '==', value: uid}]
   this.notificationSubs$ = this.notification.getNotifications(queryObj)
                             .subscribe(noti=>{
                               let alerts = [];
                               this.notificationTypes =[];
                               noti.forEach((a: any) => {
                                 const data = a.payload.doc.data();
                                 const id = a.payload.doc.id;
                                 const createdAt = new Date(data.createdAt?.seconds*1000);
                                 let idx =  this.notificationTypes.findIndex(n=>n.label == data.origin.label);
                                 if(idx!=-1){
                                   this.notificationTypes[idx].labelValue++;
                                 } else {
                                   this.notificationTypes.push({...data.origin, labelValue: 1, stack: [{cssClass: data.origin.color, width: 100, height: 1}]})
                                 }
                                 alerts.push({id, data: {...data, createdAt }});
                               });
                               this.allAlerts = alerts.sort((a:any,b:any)=>b.data.createdAt-a.data.createdAt)
                               // now graphX summary
                               let maxCount = Math.max(...this.notificationTypes.map(n=>n.labelValue))
                               maxCount = maxCount > 0 ? maxCount : 1;
                               this.notificationTypes.forEach(g=>{
                                 g.stack[0].width = g.labelValue*100/maxCount;
                               });
                               this.alertSummary.data = this.notificationTypes;
                               console.log("alerts", this.allAlerts,this.alertSummary);
                             });
 }

 actionClick(alert, action){
   // process alert click here, add code snippet as required
   if(action.href=='clear'){
     this.notification.clearNotification(alert);
   } else {
     this.router.navigate([action.href],{state: {data:{[alert.origin.label]: alert.data.refData}}});
   }
 }

}
