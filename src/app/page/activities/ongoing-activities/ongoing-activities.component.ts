import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { CalendarService } from 'src/app/shared/calendar/calendar.service';
import { ComponentsService } from '../../../shared/components/components.service';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-ongoing-activities',
  templateUrl: './ongoing-activities.component.html',
  styleUrls: ['./ongoing-activities.component.scss'],
})
@Autounsubscribe()
export class OngoingActivitiesComponent implements OnInit {
  // observables
  sessionSubs$;
  activitySubs$;
  newActivitySubs$;
  public sessionInfo: any;
  public colorStack: any[];
  public timer: any;
  public hour: number = 0;
  public minute: number = 0;
  public sec: number = 0;
  public enableEffortEditing: boolean = false;
  public allTasks: any[]; // = [];
  public showCreateActivity: boolean = false;
  public newTask: any = {
                          activeTask: [],
                          createTask: false,
                          createRetroTask: false,
                          taskName: '',
                          taskProject: {},
                          activity: {},
                          hourlyRate: 0,
                          searchTitle: '',
                          startTime: '',
                          endTime: '',
                        };

  constructor(
    private router:Router,
    private session: SessionService,
    private activity: ActivityService,
    private cal: CalendarService,
    private common:ComponentsService,
    private project: ProjectService,
  ) {
    this.colorStack = this.project.projColorStack;
    this.newActivitySubs$ = this.activity.watch().subscribe(act=>{
      console.log("activities main this.newActivitySubs", act,act?.acitivity?.activityId);
      if(act && (act?.activity?.activityId || act?.taskProject?.projectId)){
        this.startInputActivity(act);
      } else {
        // this.showCreateActivity = false;
      }
    });
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid || this.sessionInfo?.subscriberId != value?.subscriberId){
        this.allTasks = undefined;
        this.newTask = {
                          activeTask: [],
                          createTask: false,
                          createRetroTask: false,
                          taskName: '',
                          taskProject: {},
                          activity: {},
                          hourlyRate: 0,
                          searchTitle: '',
                          startTime: '',
                          endTime: '',
                        };
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
      // call getactivities if no sessionInfo to clean the subscription and timer
      // else if sessionInfo is present and not subscribed yet then subscribe to get the data
      if(!value || (value?.uid && value?.subscriberId && !this.activitySubs$?.unsubscribe)){
        this.getActivities();
      }
    });
  }

  ngOnInit() {
    this.getActivities();
  }

  ngOnDestroy(){

  }

  async startInputActivity(act){
    console.log("activities main this.startInputActivity");
    // check if we have fetched all tasks and there is no active task to show the start new activity from input
    if(this.allTasks && this.newTask.activeTask.length == 0){
      // check if its PAUSED
      let idx = this.allTasks.findIndex(t=>t.data?.status!='ACTIVE' && t.data?.activityId==act.activity?.activityId);
      if(idx==-1){
        this.showCreateActivity = true;
      } else {
        let task = this.allTasks[idx];
        this.actionOnClickActivity(task, idx,'RESUME');
      }
    } else {
      let title="Warning";
      let body = "Please note that the requested activity can not be started as there is an ongoing activity. Please check and try again."
      let buttons: any[] = [
                      {
                        text: 'Dismiss',
                        role: 'cancel',
                        cssClass: '',
                        handler: ()=>{}
                      },
                    ];

      await this.common.presentAlert(title,body ,buttons);
      this.activity.clear();
    }
  }

  // time started
  timerOnForActive(){
      setInterval(() => {

      }, 1000);
  }
  timeTicking(){
    let offsetTime = moment().diff(this.newTask.activeTask[0].data.startTime); //moment().diff(moment(this.newTask.activeTask[0].startTime.seconds*1000)); // - this.session.admin.timeOffset;
    this.hour = Math.floor(offsetTime/(60*60*1000));
    this.minute = Math.floor((offsetTime%(60*60*1000))/(60*1000));
    this.sec = Math.floor((offsetTime%(60*1000))/(1000));
  }

  openSearchActivities(){
    this.router.navigateByUrl('activities/activity-search');
  }
  // search implement
  async getActivities(){
    let queryObj = [];
    if(this.activitySubs$?.unsubscribe){
      await this.activitySubs$.unsubscribe();
    }
    if(this.sessionInfo?.uid && this.sessionInfo?.subscriberId){
      const {subscriberId, uid} = this.sessionInfo;
      queryObj = [
                  {field: 'subscriberId',operator: '==', value: subscriberId},
                  {field: 'uid',operator: '==', value: uid},
                  {field: 'status',operator: 'in', value: ['ACTIVE','PAUSE']}
                  ];
      this.activitySubs$ = this.activity.getActivities(queryObj)
                            .subscribe(async act=>{
                              let allActivities = act.map((a: any) => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                const startTime = new Date(data.startTime?.seconds*1000);
                                const endTime = new Date(data.endTime?.seconds*1000);
                                const projectNo = data.project.projectId.replace(/[A-Z]/,'');
                                // return {id, data};
                                return {id, projectNo, data: {...data, startTime, endTime}};
                              });

                              this.allTasks =[];
                              this.newTask.activeTask = [];
                              this.allTasks = allActivities.sort((a,b)=>(a.data.status=='ACTIVE' ? 0 : 1 )-(b.data.status=='ACTIVE' ? 0 : 1 ));
                              this.newTask.activeTask= this.allTasks.filter(t=>t.data.status=='ACTIVE');

                              console.log("this.newTask.activeTask", this.newTask.activeTask, this.allTasks);

                              if(this.newTask.activeTask.length > 0){
                                if(this.timer){
                                  await clearInterval(this.timer);
                                }
                                this.timer = setInterval(()=>{this.timeTicking();}, 1000);
                              } else {
                                if(this.timer){
                                  await clearInterval(this.timer);
                                }
                                this.timer = null;
                              }

                              console.log("activities", this.allTasks, this.timer );

                            });
    } else {
      console.log("else part to clear interval", this.timer);
      if(this.timer){
        await clearInterval(this.timer);
        this.timer = null;
      }
    }

  }

  async actionOnClickActivity(task,idx, event){
    let title="Confirm";
    let body = "Are you sure you want to " + event + " the activity '" + task?.data?.name + "' ?"
    let buttons: any[] = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{}
                    },
                    {
                      text: 'Continue',
                      role: '',
                      cssClass: 'alert-button-selected',
                      handler: ()=>this.proceedOnClickActivity(task,idx, event)
                    }
                  ];

    await this.common.presentAlert(title,body ,buttons);
  }

  async proceedOnClickActivity(task,idx, event){
    this.common.showLoader("Processing activity '" + task?.data?.project.title + "'");
    let actionValidated = true;
    // let endTime = new Date(data.startTime.seconds*1000 + (this.hour * 60 * 60 + this.minute * 60 + this.sec * 1) * 1000);
    let endTime = new Date(task.data.startTime.getTime() + (this.hour * 60 * 60 + this.minute * 60 + this.sec * 1) * 1000);
    // Check if the event is pause/complete
    actionValidated = await this.validateActivityEffort(task.data, event);
    if(actionValidated) {
        this.enableEffortEditing = false;
        // pick location
        // await this.checkGPS().then(async () => {
        // create new activity
        // get location data
          let coordinates = await this.session.getCurrentPosition();
          if(coordinates){
            task.data.locationComplete = (task.data.status == 'PAUSE' && event=='COMPLETE') ?
                                    task.data.locationComplete
                                    : {
                                        latitude: coordinates.coords.latitude,
                                        longitude: coordinates.coords.longitude,
                                        altitude: coordinates.coords.altitude,
                                        accuracy: coordinates.coords.accuracy,
                                        altitudeAccuracy: coordinates.coords.altitudeAccuracy,
                                        heading: coordinates.coords.heading,
                                        speed: coordinates.coords.speed,
                                      };
            task.data.effort = this.hour*1 + this.minute/60;
            task.data.billingAmount = task.data.effort * task.data.rate;
            task.data.endTime = new Date(endTime) , //new Date(moment().valueOf() - this.session.admin.timeOffset); // firebase.firestore.FieldValue.serverTimestamp(),
            await this.activity.logActivitySummary(event, task , this.sessionInfo, null);
          } else {
            let title = "Warning";
            let body = "Activity can not be "+ event.toLowerCase() + "d. It seems location service is not activated or permission is not allowed. Please enable location service and try again.";
            let buttons: any[] = [
                            {
                              text: 'Dismiss',
                              role: 'cancel',
                              cssClass: '',
                              handler: ()=>{}
                            }
                          ];

            await this.common.presentAlert(title,body ,buttons);
            this.common.hideLoader();
          }
          // console.log("new end date time", data.startTime, endTime, moment(endTime).format('ll'), new Date(endTime))
          setTimeout(()=>this.common.hideLoader(),300);
        // }).catch(err => {
        //   this.session.user.loader = false;
        //   this.sfp.defaultAlert("Couldn't get location","When getting location there was some error. please retry.");
        // })
    }
    setTimeout(()=>this.common.hideLoader(),300);
  }

  actionCancelEditEffort(){
    if(this.timer){
      clearInterval(this.timer);
    }
    this.timer = setInterval(()=>{this.timeTicking();}, 1000);
    this.enableEffortEditing = false;
  }

  async validateActivityEffort(data,event){
    let actionValidated = true;
    // Check if the event is pause/complete
    if(data.status == 'ACTIVE' && ['PAUSE','COMPLETE'].includes(event)){
      let endTime = new Date(data.startTime.getTime() + (this.hour * 60 * 60 + this.minute * 60 + this.sec * 1) * 1000);
      // check whether effort corossed 12 hrs or date changed
      if(this.timer){
        clearInterval(this.timer);
      }
      if(
        // not same day
        moment(data.startTime).format('YYYYMMDD') != moment(endTime).format('YYYYMMDD') ||
        this.hour >= 24
      ) {
        let offsetTime = moment(moment(data.startTime).format('YYYY-MM-DD 24:00')).diff(this.newTask.activeTask[0].data.startTime); //moment().diff(moment(this.newTask.activeTask[0].startTime.seconds*1000)); // - this.session.admin.timeOffset;
        let hour = Math.floor(offsetTime/(60*60*1000));
        let minute = Math.floor((offsetTime%(60*60*1000))/(60*1000));

        this.enableEffortEditing = true;
        actionValidated = false;
        let title="Warning";
        let body = "The duration of the activity is beyond 12 midnight. Please edit duration to be less than " + hour + " hr " + minute + " min and submit. Create rest of it, if any, using fill timesheet for next day.";
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        },
                      ];

        await this.common.presentAlert(title,body ,buttons);
      }
    }
    return actionValidated;
  }

  startNewActivity(){
    this.showCreateActivity = !this.showCreateActivity;
    this.activity.clear();
  }

  gotoTimeSheet(){
    this.router.navigate(['/timesheet/fill-timesheet']);
  }

  toSearchActivity(task){
    // TBA
  }

}
