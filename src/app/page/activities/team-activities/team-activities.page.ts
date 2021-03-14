import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { CalendarService } from 'src/app/shared/calendar/calendar.service';
import { ComponentsService } from '../../../shared/components/components.service';
import { GraphService } from 'src/app/shared/graph/graph.service';

@Component({
  selector: 'app-team-activities',
  templateUrl: './team-activities.page.html',
  styleUrls: ['./team-activities.page.scss'],
})
@Autounsubscribe()
export class TeamActivitiesPage implements OnInit {
  // observables
  sessionSubs$;
  ongoingActivitySubs$;
  activitySubs$;
  public sessionInfo: any;
  public allOngoingTasks: any[] = [];
  public allOtherTasks: any[] = [];
  public viewMode: string = "monthly";
  public graphData: any;
  public graphMode: string = "efforts";
  public summaryMode: string = 'summary';
  public detailedViewMode: string = 'projects';
  public startPeriod: string = moment().format('YYYY-MM-DD');
  public endPeriod: string = moment().format('YYYY-MM-DD');
  public minPeriod: string = moment().subtract(5,'y').format('YYYY-MM-DD');
  public maxPeriod: string = moment().format('YYYY-MM-DD');
  public maxPeriodWeek: string = moment().format('YYYY-MM-DD');
  public startMonth: string;
  public endMonth: string;

  constructor(
    private router:Router,
    private session: SessionService,
    private activity: ActivityService,
    private cal: CalendarService,
    private common:ComponentsService,
    private graph: GraphService,
  ) {
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid || this.sessionInfo?.subscriberId != value?.subscriberId){
        this.allOngoingTasks = [];
        this.allOtherTasks = [];
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
      // call getactivities if no sessionInfo to clean the subscription and timer
      // else if sessionInfo is present and not subscribed yet then subscribe to get the data
      if(!value || (value?.uid && value?.subscriberId && !this.ongoingActivitySubs$?.unsubscribe && !this.activitySubs$?.unsubscribe)){
        this.getActivities();
      }
    });
  }

  ngOnInit() {
    this.getActivities();
  }

  ngOnDestroy(){

  }

  viewModeChanged(e){
    this.viewMode = e.detail.value;
  }

  graphModeChanged(e){
    this.graphMode = e.detail.value;
  }

  summaryModeChanged(e){
    this.summaryMode = e.detail.value;
  }

  detailedViewModeChanged(e){
    this.detailedViewMode = e.detail.value;
  }

  ionMonthChange(){
    this.minPeriod = moment(this.startPeriod).subtract(5,'y').format('YYYY-MM-DD');
    this.maxPeriod = moment(this.endPeriod).add(5,'y').format('YYYY-MM-DD') > moment().format('YYYY-MM-DD') ?
                     moment().format('YYYY-MM-DD')
                     :
                     moment(this.endPeriod).add(5,'y').format('YYYY-MM-DD');
    this.getOtherActivities();
  }

  ionWeekChange(){
    // this.startPeriod = moment(this.startPeriod).startOf('isoWeek');
    this.endPeriod = moment(this.startPeriod).endOf('isoWeek').format('YYYY-MM-DD');
    this.maxPeriodWeek = moment().format('YYYY-MM-DD');
    this.getOtherActivities();
  }

  // search implement
  async getActivities(){
    this.getOngoingActivities();
    this.getOtherActivities();
  }
  async getOngoingActivities(){
    let queryObj = [];
    if(this.ongoingActivitySubs$?.unsubscribe){
      await this.ongoingActivitySubs$.unsubscribe();
    }
    if(this.sessionInfo?.uid && this.sessionInfo?.subscriberId){
      const {subscriberId, uid} = this.sessionInfo;
      queryObj = [
                  {field: 'subscriberId',operator: '==', value: subscriberId},
                  {field: 'status',operator: 'in', value: ['ACTIVE','PAUSE']}
                  ];
      this.ongoingActivitySubs$ = this.activity.getActivities(queryObj)
                            .subscribe(async act=>{
                              let allActivities = act.map((a: any) => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                const startTime = new Date(data.startTime?.seconds*1000);
                                const endTime = new Date(data.endTime?.seconds*1000);
                                const statusLabel = data.status == 'ACTIVE' ?
                                                    'Started working '+ moment(startTime).fromNow()
                                                    :
                                                    'Last worked ' + moment(endTime).fromNow();
                                // return {id, data};
                                return {id, data: {...data, startTime, endTime, statusLabel}};
                              });

                              this.allOngoingTasks =[];
                              this.allOngoingTasks = allActivities.sort((a,b)=>(b.data.startTime)-(a.data.startTime));


                              console.log("allOngoingTasks", this.allOngoingTasks, subscriberId);

                            });
    } else {
    }

  }

  async getOtherActivities(viewType: any = 'w'){
    let queryObj = [];
    let startMonth = this.viewMode=='monthly' ? moment(this.startPeriod).format('YYYYMM') : moment(this.startPeriod).startOf('isoWeek').format('YYYYMM'); //moment().startOf('isoWeek').format('YYYYMM');
    let endMonth = moment(this.endPeriod).format('YYYYMM'); //moment().endOf('isoWeek').format('YYYYMM');

    if(this.startMonth<=startMonth  && this.endMonth>=endMonth){
      // no need to run the get activity call
      this.graphData = this.graph.processTeamViewUserSummary(this.allOtherTasks, this.viewMode, this.startPeriod, this.endPeriod);
      console.log("summary graphData without fetch", this.graphData);
    } else {
      if(this.activitySubs$?.unsubscribe){
        await this.activitySubs$.unsubscribe();
      }
      if(this.sessionInfo?.uid && this.sessionInfo?.subscriberId){
        const {subscriberId, uid} = this.sessionInfo;
        queryObj = [
                    {field: 'subscriberId',operator: '==', value: subscriberId},
                    // {field: 'yearMonth',operator: 'in', value: [startMonth, endMonth]},
                    {field: 'yearMonth',operator: '>=', value: startMonth},
                    {field: 'yearMonth',operator: '<=', value: endMonth}
                    ];
        this.startMonth = startMonth;
        this.endMonth = endMonth;
        this.activitySubs$ = this.activity.getActivitiesSummary(queryObj)
                              .subscribe(async act=>{
                                let allActivities = act.map((a: any) => {
                                  const data = a.payload.doc.data();
                                  const id = a.payload.doc.id;
                                  // return {id, data};
                                  let projectList = Object.keys(data.projects);
                                  let activityList = Object.keys(data.activities);
                                  let monthMedium = moment('2021-'+data.month+'-01').format('MMM');
                                  let year = data.yearMonth.substr(0,4);
                                  return {id, data, projectList, activityList, monthMedium, year};
                                });
                                console.log("summary", allActivities, queryObj);
                                this.allOtherTasks = allActivities.sort((a,b)=>((b.data.uid < a.data.uid ? 1: -1)))
                                console.log("summary this.allOtherTasks", this.allOtherTasks, queryObj);
                                this.graphData = this.graph.processTeamViewUserSummary(this.allOtherTasks, this.viewMode, this.startPeriod, this.endPeriod);
                                console.log("summary graphData", this.graphData);
                              });
      } else {
      }
    }


  }


}
