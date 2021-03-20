import { Component, NgModule, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { CalendarService } from 'src/app/shared/calendar/calendar.service';
import { GraphService } from 'src/app/shared/graph/graph.service';

@Component({
  selector: 'app-activities-summary',
  templateUrl: './activities-summary.component.html',
  styleUrls: ['./activities-summary.component.scss'],
})
@Autounsubscribe()
export class ActivitiesSummaryComponent implements OnInit {
  @Input() fullWidth: boolean = false;
  // observables
  sessionSubs$;
  activitySummarySubs$;
  public sessionInfo: any;
  public selectedMonth: string = moment().format('YYYY-MM-DD');
  public totalEffort = 0;
  public avgEffort = 0;
  public monthlyBillingAmount = 0;
  public graphMode: string = "efforts";
  public graphData: any;
  public graphY:any = {
      icon: 'stats-chart',
      title: 'Daily activities for ' + moment().format('MMM, YYYY'),
      // maxValue: 1,
      // data: [],
    };
  public graphX:any = {
      icon: 'bookmark-outline',
      title: 'Project activities for ' + moment().format('MMM, YYYY'),
      // maxValue: 1,
      // data: [],
    };

  constructor(
    private router:Router,
    private session: SessionService,
    private activity: ActivityService,
    private graph: GraphService,
  ) {
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid || this.sessionInfo?.subscriberId != value?.subscriberId){
        this.graphY = {
            icon: 'stats-chart',
            title: 'Daily activities for ' + moment().format('MMM, YYYY'),
            // maxValue: 1,
            // data: [],
          };
        this.graphX = {
            icon: 'bookmark-outline',
            title: 'Project activities for ' + moment().format('MMM, YYYY'),
            // maxValue: 1,
            // data: [],
          };
        if(value?.uid && value?.subscriberId){
          this.sessionInfo = value;
          this.getUserSummary();
        }
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
      if(value?.uid && value?.subscriberId && !this.activitySummarySubs$?.unsubscribe){
        this.getUserSummary();
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy(){

  }


  // get summary
  async getUserSummary(){
    let yearMonth = moment(this.selectedMonth).format('YYYYMM');
    console.log("this.selectedMonth",this.selectedMonth, yearMonth)
    let queryObj = [];
    if(this.activitySummarySubs$?.unsubscribe){
      await this.activitySummarySubs$.unsubscribe();
    }
    if(this.sessionInfo?.uid && this.sessionInfo?.subscriberId){
      const {subscriberId, uid} = this.sessionInfo;
      queryObj = [
                  {field: 'subscriberId',operator: '==', value: subscriberId},
                  {field: 'uid',operator: '==', value: uid},
                  {field: 'yearMonth',operator: '==', value: yearMonth}
                  ];

      this.activitySummarySubs$ = this.activity.getActivitiesSummary(queryObj)
                            .subscribe(summary=>{
                                let allSummeries = summary.map((a: any) => {
                                  const data = a.payload.doc.data();
                                  const id = a.payload.doc.id;
                                  return {id, ...data};
                                });
                                // console.log("summary", allSummeries, yearMonth, queryObj);
                                this.graphData = this.graph.processUserSummary(allSummeries, this.selectedMonth);
                                this.totalEffort = this.graphData.totalEffort;
                                this.avgEffort = this.graphData.avgEffort;
                                // if its a large value represent differently
                                this.monthlyBillingAmount = this.graphData.monthlyBillingAmount;
                                let lgraphX = this.graphMode=='efforts' ? this.graphData.graphX : this.graphData.graphX$;
                                let lgraphY = this.graphMode=='efforts' ? this.graphData.graphY : this.graphData.graphY$;
                                this.graphX = {...lgraphX, icon: 'bookmark-outline', title: 'Project ' + this.graphMode + ' for ' + moment(this.selectedMonth).format('MMM, YYYY')};
                                this.graphY = {...lgraphY, icon: 'stats-chart', title: 'Daily ' + this.graphMode + ' for ' + moment(this.selectedMonth).format('MMM, YYYY'), xAxisFrequency: 7};
                              });
    }
  }

  graphModeChanged(e){
    this.graphMode = e.detail.value;
    let lgraphX = this.graphMode=='efforts' ? this.graphData.graphX : this.graphData.graphX$;
    let lgraphY = this.graphMode=='efforts' ? this.graphData.graphY : this.graphData.graphY$;
    this.graphX = { ...lgraphX, icon: 'bookmark-outline', title: 'Project ' + this.graphMode + ' for ' + moment(this.selectedMonth).format('MMM, YYYY') + (this.graphMode=='efforts' ? ' (in hr)' : ' (in $)')};
    this.graphY = { ...lgraphY, icon: 'stats-chart', title: 'Daily ' + this.graphMode + ' for ' + moment(this.selectedMonth).format('MMM, YYYY')  + (this.graphMode=='efforts' ? ' (in hr)' : ' (in $)'), xAxisFrequency: 7};
  }

}
