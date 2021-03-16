import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CalendarComponentOptions } from 'ion2-calendar';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { CalendarService } from 'src/app/shared/calendar/calendar.service';
import { CalendarModule } from 'ion2-calendar';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-activity-search',
  templateUrl: './activity-search.component.html',
  styleUrls: ['./activity-search.component.scss'],
})
@Autounsubscribe()
export class ActivitySearchComponent implements OnInit {
  @Input() closeSearch: any = ()=>{};
  // observables
  sessionSubs$;
  activitySubs$;
  public sessionInfo: any;
  public searchText: string;
  public searchMode: string = 'all';
  public searchModeUser: string = 'user';
  public options: any;
  public viewResult: any = {};
  public allDates:any=[];
  public dateRange:any = {
                            startDate: '',
                            endDate: ''
                          };
  public colorStack: any[];
  constructor(
    private router:Router,
    private session: SessionService,
    private activity: ActivityService,
    private cal: CalendarService,
    private project: ProjectService,
  ) {

    this.options = this.cal.getCalendarMeta();
    this.colorStack = this.project.projColorStack;

    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid){
        this.viewResult = {};
        this.allDates = [];
        this.searchText = '';
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });

  }

  ngOnInit() {
    this.cal.renderDataSet(this.options);
  }

  ngOnDestroy(){

  }

  calendarOptionsChanged(e){
    let pickMode = e.detail.value;
    this.options.calendarOptions.pickMode = pickMode;
    this.cal.renderDataSet(this.options);
  }

  SearchOptionsChanged(e){
    this.searchMode = e.detail.value;
    this.getActivities();
  }

  SearchUserOptionsChanged(e){
    this.searchModeUser = e.detail.value;
    this.getActivities();
  }

  ionChange(e){
    this.dateRange = {
                        startDate: '',
                        endDate: ''
                      };
    this.getActivities();
  }

  onClear(e){
    this.viewResult = {};
    this.allDates = [];
  }

  dateFormater(date,format){
    return moment(date).format(format ? format : "ll");
  }
  // search implement
  getActivities(){
    let searchTextObj = null;
    let queryObj = [];
    if(this.activitySubs$?.unsubscribe){
      this.activitySubs$.unsubscribe();
    }

    queryObj = [{field: 'subscriberId',operator: '==', value: this.sessionInfo.subscriberId}];
    if(this.searchModeUser=='user'){
      queryObj.push({field: 'uid',operator: '==', value: this.sessionInfo.uid})
    }
    if(this.dateRange.startDate){
      queryObj.push({field: 'startTime',operator: '>=', value: this.dateRange.startDate});
    }
    if(this.dateRange.endDate){
      queryObj.push({field: 'startTime',operator: '<=', value: this.dateRange.endDate});
    }
    if(this.searchText?.trim().length>=3){
      searchTextObj = {seachField: 'searchMap', text: this.searchText.trim(), searchOption: this.searchMode};
    }
    if(this.searchText?.trim().length>=3 || this.dateRange.startDate){ // or dates selected
      this.activitySubs$ = this.activity.getActivities(queryObj, searchTextObj)
                            .subscribe(act=>{
                              let allActivities = act.map((a: any) => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                const startTime = new Date(data.startTime?.seconds*1000);
                                const endTime = data.endTime?.seconds ? new Date(data.endTime?.seconds*1000) : null;
                                return {id, data: { ...data, startTime, endTime }};
                              });
                              this.viewResult = {};
                              this.allDates = [];
                              allActivities.sort((a:any,b:any)=>a.data.startTime-b.data.startTime).forEach((a:any)=>{
                                let datetocheck = this.dateFormater(a.data.startTime,'ll');
                                if(this.allDates.includes(datetocheck)){
                                  this.viewResult[datetocheck].push(a);
                                } else {
                                  this.allDates.push(datetocheck);
                                  this.viewResult[datetocheck]=[a,];
                                }
                              });
                              console.log("activities", this.viewResult, this.allDates);
                            });
    }


  }

  onSelect(event){
    if(this.options.calendarOptions.pickMode=='single'){
      this.dateRange.startDate = new Date(event.time);
      this.dateRange.endDate = new Date(event.time + 24*60*60*1000);
      this.searchText ='';
      this.getActivities();
    } else {
      // Do nothing
    }
    console.log("onselect", this.dateRange);
  }

  onSelectStart(event){
    this.dateRange.startDate = new Date(event.time);
  }

  onSelectEnd(event){
    this.dateRange.endDate = new Date(event.time + 24*60*60*1000);
    // The timeout is added here as onSelectStart will be called if end date is less than start date
    setTimeout(()=>{
      this.searchText ='';
      this.getActivities();
    },100);
  }
  async monthChanges(e){
    // get the selected month and year
    const month = e.newMonth.months.toString().padStart(2, '0');
    const year = e.newMonth.years;
    // this.calendarDetails.monthStartDate =  moment(year+month+'01','YYYYMMDD').startOf('month'); //.subtract(1,'month');
    // this.calendarDetails.monthEndDate = moment(year+month+'01','YYYYMMDD').endOf('month'); //.add(1,'month');

  }

  toSearchActivity(data){
    // TBA
  }

}
