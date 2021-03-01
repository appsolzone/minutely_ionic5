import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { CalendarService } from 'src/app/shared/calendar/calendar.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { TimesheetService } from 'src/app/shared/timesheet/timesheet.service';
import { ComponentsService } from '../../../shared/components/components.service';

@Component({
  selector: 'app-fill-timesheet',
  templateUrl: './fill-timesheet.page.html',
  styleUrls: ['./fill-timesheet.page.scss'],
})
@Autounsubscribe()
export class FillTimesheetPage implements OnInit {
  // observables
  sessionSubs$;
  activitySummarySubs$;
  public activitysummaryData: any[]=[];
  public newTimeSheetData: any[]=[];
  public timeSheetData: any[]=[];
  public wdEntryData: any = null;
  public wdEntryDataIndex: number = null;
  public options: any;
  public sessionInfo: any;
  public yearMonth1: string;
  public yearMonth2: string;
  public addNewActivity: boolean = false;
  public dateRange:any = {
                            startDate: null, //new Date(moment().startOf('isoWeek').format('YYYY-MM-DD')),
                            endDate: null, //new Date(moment().endOf('isoWeek').format('YYYY-MM-DD'))
                          };
  public weekDays: any[] =  [
                              {short:'M', medium: 'Mon'},
                              {short:'T', medium: 'Tue'},
                              {short:'W', medium: 'Wed'},
                              {short:'T', medium: 'Thu'},
                              {short:'F', medium: 'Fri'},
                              {short:'S', medium: 'Sat'},
                              {short:'S', medium: 'Sun'}
                            ];
  constructor(
    private router:Router,
    private session: SessionService,
    private cal: CalendarService,
    private activity: ActivityService,
    private timesheet: TimesheetService,
    private component: ComponentsService,
  ) {
    this.options = this.cal.getCalendarMeta();
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid){
        // TBA
        this.dateRange = { startDate: null, endDate: null };
        this.activitysummaryData = [];
        this.timeSheetData = [];
        this.newTimeSheetData = [];
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

  ngOnInit() {

  }

  ngOnDestroy(){

  }

  onSelect(event){
    if(this.options.calendarOptions.pickMode=='single'){
      // since our calemdar is monday to sunday
      this.dateRange.startDate = new Date(moment(event.time).startOf('isoWeek').format('YYYY-MM-DD'));
      this.dateRange.endDate = new Date(moment(event.time).endOf('isoWeek').format('YYYY-MM-DD'));
      this.getUserSummary();
    } else {
      // Do nothing
    }
    console.log("onselect", this.dateRange);
  }

  // get summary
  async getUserSummary(){
    this.component.showLoader("Fetching timesheet data, please wait...");
    let yearMonth1 = moment(this.dateRange.startDate).format('YYYYMM');
    let yearMonth2 = moment(this.dateRange.endDate).format('YYYYMM');
    if(
      ((yearMonth1==yearMonth2 && ![this.yearMonth1, this.yearMonth2].includes(yearMonth1)) || yearMonth1!=yearMonth2) &&
      (this.yearMonth1 != yearMonth1 || this.yearMonth2 != yearMonth2)
      ){
      this.addNewActivity = false;
      this.yearMonth1 = yearMonth1;
      this.yearMonth2 = yearMonth2;
      this.activitysummaryData = [];
      this.newTimeSheetData = [];
      console.log("this.selectedMonth",this.yearMonth1, this.yearMonth2)
      let queryObj = [];
      if(this.activitySummarySubs$?.unsubscribe){
        await this.activitySummarySubs$.unsubscribe();
      }
      if(this.sessionInfo?.uid && this.sessionInfo?.subscriberId){
        const {subscriberId, uid} = this.sessionInfo;
        queryObj = [
                    {field: 'subscriberId',operator: '==', value: subscriberId},
                    {field: 'uid',operator: '==', value: uid},
                    {field: 'yearMonth',operator: 'in', value: [this.yearMonth1, this.yearMonth2]}
                    ];

        this.activitySummarySubs$ = this.activity.getActivitiesSummary(queryObj)
                              .subscribe(summary=>{
                                  let allSummeries = summary.map((a: any) => {
                                    const data = a.payload.doc.data();
                                    const id = a.payload.doc.id;
                                    return {id, ...data};
                                  });
                                  this.activitysummaryData = allSummeries;
                                  console.log("allSummeries", allSummeries, this.yearMonth1, this.yearMonth2, queryObj);
                                  this.timeSheetData = this.timesheet.extractTimesheet(this.activitysummaryData,this.dateRange.startDate, this.dateRange.endDate);
                                  console.log("allSummeries", allSummeries, this.timeSheetData);
                                  setTimeout(()=>this.component.hideLoader(),500);

                                });
      }

    }else {
      // we already have the data, just process it again
      this.addNewActivity = false;
      this.newTimeSheetData = [];
      this.timeSheetData = this.timesheet.extractTimesheet(this.activitysummaryData,this.dateRange.startDate, this.dateRange.endDate);
      setTimeout(()=>this.component.hideLoader(),500);
    }
  }

  addNewActivityData(data: any = null, wdEntryDataIndex: number = null){
    if(data && wdEntryDataIndex == null){
      this.newTimeSheetData.push(data);
    } else if(data && wdEntryDataIndex != null){
      this.newTimeSheetData[wdEntryDataIndex] = data;
    }
    console.log("new data",this.newTimeSheetData );
    this.addNewActivity = !this.addNewActivity;
    this.wdEntryData = null;
    this.wdEntryDataIndex = null;
  }
  editActivity(data: any = null, index: number = null){
    this.addNewActivity = !this.addNewActivity;
    this.wdEntryData = data;
    this.wdEntryDataIndex = index;
  }
  removeActivity(index){
    this.newTimeSheetData.splice(index,1);
  }

  async saveTimesheet(){
    // TBA
    this.component.showLoader("Saving timesheet entries, please wait .....")
    if(this.activitySummarySubs$?.unsubscribe){
      await this.activitySummarySubs$.unsubscribe();
    }
    let message = await this.timesheet.saveTimesheet(this.sessionInfo,this.newTimeSheetData);
    setTimeout(()=>this.component.hideLoader(),150);
    let title=message.title;
    let body = message.body
    let buttons: any[] = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{}
                    }
                  ];

    await this.component.presentAlert(title,body ,buttons);
    if(message.status){
      // successfully saved
      this.newTimeSheetData =  [];
      this.yearMonth1 = null;
      this.yearMonth2 = null;
    } else {
      // not successful so do nothing
    }
    this.getUserSummary();
  }

}
