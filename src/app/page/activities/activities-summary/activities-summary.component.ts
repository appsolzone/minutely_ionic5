import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { CalendarService } from 'src/app/shared/calendar/calendar.service';

@Component({
  selector: 'app-activities-summary',
  templateUrl: './activities-summary.component.html',
  styleUrls: ['./activities-summary.component.scss'],
})
@Autounsubscribe()
export class ActivitiesSummaryComponent implements OnInit {
  // observables
  sessionSubs$;
  activitySummarySubs$;
  public sessionInfo: any;
  public selectedMonth: string = moment().format('YYYY-MM-DD');
  public avgEffort = 0;
  public monthlyBillingAmount = 0;
  public graphY:any = {
      icon: 'stats-chart',
      title: 'Daily activities for ' + moment().format('MMM, YYYY'),
      maxValue: 1,
      // data: [],
    };

  constructor(
    private router:Router,
    private session: SessionService,
    private activity: ActivityService,
  ) {
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid || this.sessionInfo?.subscriberId != value?.subscriberId){
        this.graphY = {
            icon: 'stats-chart',
            title: 'Daily activities for ' + moment().format('MMM, YYYY'),
            maxValue: 1,
            // data: [],
          };
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
                                this.processUserSummary(allSummeries);
                              });
    }
  }

  // callback function to process user summary data
  processUserSummary(summeriesArray){
    let summeries = summeriesArray ? summeriesArray[0] : null;
    let effort = summeries ? summeries.effort : 0;
    let billingAmount = summeries ? summeries.billingAmount : 0;
    let noofdays: number = parseInt(moment(this.selectedMonth).endOf('month').format('DD'));

    this.avgEffort = effort/noofdays;
    // if its a large value represent differently
    this.monthlyBillingAmount = billingAmount >= 1000000 ?
                                (billingAmount/1000000).toFixed(1) + ' M'
                                :
                                billingAmount >= 1000 ?
                                (billingAmount/1000).toFixed(1) + ' K'
                                :
                                (billingAmount).toFixed(1);

    let graphY: any={
        icon: 'stats-chart',
        title: 'Daily activities for ' + moment(this.selectedMonth).format('MMM, YYYY'),
        maxValue: 1,
        data: [],
      };

    if(summeries){
      let efforts = summeries && summeries.details ? Object.keys(summeries.details).map(d=>summeries.details[d].effort) : [];
      graphY.maxValue = efforts.length > 0 ? Math.max(...efforts) : 1;
      graphY.maxValue = graphY.maxValue.toFixed(1)*1;
      let startDate = moment(this.selectedMonth).startOf('month');
      while(startDate<=moment(this.selectedMonth).endOf('month')){
        // loop through the days
        let day = moment(startDate).format('YYYYMMDD');
        let dataObj = {};
        if(summeries.details[day]){
          dataObj = {
            label: moment(startDate).format('DD'),
            lavelValue: '',
            stack: [{cssClass: 'warning', height: (summeries.details[day].effort*100/graphY.maxValue)}]
          }
        } else {
          dataObj = {
            label: moment(startDate).format('DD'),
            lavelValue: '',
            stack: [{cssClass: 'warning', height: 0}]
          }
        }
        graphY.data.push(dataObj);

        startDate = moment(startDate).add(1,'day');
      }

      // this.graphY = graphY;
      // this.graphY.xAxisFrequency = Math.floor(this.graphY.data.length/4);
    }
    this.graphY = graphY;
    this.graphY.xAxisFrequency = Math.floor(this.graphY.data.length/4);
    // console.log("graphY", this.graphY);

  }

}
