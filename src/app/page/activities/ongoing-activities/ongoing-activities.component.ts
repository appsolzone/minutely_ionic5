import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { CalendarService } from 'src/app/shared/calendar/calendar.service';

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
  public sessionInfo: any;
  public timer: any;
  public hour: number = 0;
  public minute: number = 0;
  public sec: number = 0;
  public enableEffortEditing: boolean = false;
  public allTasks: any[] = [];
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
  ) {
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid || this.sessionInfo?.subscriberId != value?.subscriberId){
        this.allTasks = [];
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
                                // return {id, data};
                                return {id, data: {...data, startTime, endTime}};
                              });

                              this.allTasks =[];
                              this.newTask.activeTask = [];
                              this.allTasks = allActivities.sort((a,b)=>(a.data.status=='ACTIVE' ? 0 : 1 )-(b.data.status=='ACTIVE' ? 0 : 1 ));
                              this.newTask.activeTask= this.allTasks.filter(t=>t.data.status=='ACTIVE');

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

}
