import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { GraphService } from 'src/app/shared/graph/graph.service';

@Component({
  selector: 'app-team-activity-stats',
  templateUrl: './team-activity-stats.component.html',
  styleUrls: ['./team-activity-stats.component.scss'],
})
@Autounsubscribe()
export class TeamActivityStatsComponent implements OnInit {
  @Input() sessionInfo: any;
  // observables
  activitySubs$;
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
    private activity: ActivityService,
    private common:ComponentsService,
    private graph: GraphService,
  ) {
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
    this.getOtherActivities();
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
