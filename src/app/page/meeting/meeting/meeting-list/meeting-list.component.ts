import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CalendarComponentOptions } from 'ion2-calendar';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { CalendarService } from 'src/app/shared/calendar/calendar.service';
import { MeetingService } from 'src/app/shared/meeting/meeting.service';
import { Meeting } from 'src/app/interface/meeting';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss'],
})
@Autounsubscribe()
export class MeetingListComponent implements OnInit {
  @Input() showOnlyUpcommingMeetings: boolean = false;
  // observables
  sessionSubs$;
  meetingsSubs$;
  public showSearchModesforUpcomming: boolean = false;
  public sessionInfo: any;
  public searchText: string;
  public limit: any = 20;
  public searchMode: string = 'all';
  public searchModeUser: string = 'user';
  public options: any;
  public viewMeetingResult: any = [];
  public dateRange:any = {
                            startDate: '',
                            endDate: ''
                          };
  public colorStack: any[];

  constructor(
    private router:Router,
    private session: SessionService,
    private cal: CalendarService,
    private meeting: MeetingService
  ) {
    this.options = this.cal.getCalendarMeta();
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid){
        this.viewMeetingResult = [];
        this.searchText = '';
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
      if( this.sessionInfo?.subscriberId && this.sessionInfo?.uid && this.showOnlyUpcommingMeetings && !this.meetingsSubs$){
        this.getUpcommingMeetings();
      }
    });
  }

  ngOnInit() {
    this.cal.renderDataSet(this.options);
    if(this.showOnlyUpcommingMeetings && this.sessionInfo?.subscriberId && this.sessionInfo?.uid){
      this.getUpcommingMeetings();
    }
  }

  ionViewDidEnter(){
    if(this.showOnlyUpcommingMeetings && this.sessionInfo?.subscriberId && this.sessionInfo?.uid){
      this.getUpcommingMeetings();
    }
  }

  ngOnDestroy(){

  }

  getUpcommingMeetings(){
    this.limit = null;
    this.dateRange = {
                        startDate: new Date(), //moment().subtract(1,'y').format('YYYY-MM-DD')
                        endDate: new Date(moment().add(1,'d').format('YYYY-MM-DD'))
                      };
    this.getMeetings();
  }

  calendarOptionsChanged(e){
    let pickMode = e.detail.value;
    this.options.calendarOptions.pickMode = pickMode;
    this.cal.renderDataSet(this.options);
  }

  SearchOptionsChanged(e){
    this.searchMode = e.detail.value;
    this.searchModeUser = 'all';
    this.getMeetings();
  }

  SearchUserOptionsChanged(e){
    this.searchModeUser = e.detail.value;
    this.getMeetings();
  }

  ionChange(e){
    this.dateRange = {
                        startDate: '',
                        endDate: ''
                      };
    this.getMeetings();
  }

  onClear(e){
    this.viewMeetingResult = [];
  }

  dateFormater(date,format){
    return moment(date).format(format ? format : "ll");
  }
  // search implement
  getMeetings(){
    let searchTextObj = null;
    let queryObj = [];
    if(this.meetingsSubs$?.unsubscribe){
      this.meetingsSubs$.unsubscribe();
    }

    queryObj = [{field: 'subscriberId',operator: '==', value: this.sessionInfo.subscriberId}];

    if(this.searchModeUser=='user'){
      queryObj.push({field: 'attendeeUidList',operator: 'array-contains-any', value: [this.sessionInfo.uid]})
    }
    if(this.dateRange.startDate){
      queryObj.push({field: 'meetingStart',operator: '>=', value: this.dateRange.startDate});
    }
    if(this.dateRange.endDate){
      queryObj.push({field: 'meetingStart',operator: '<=', value: this.dateRange.endDate});
    }
    if(this.searchText?.trim().length>=3){
      searchTextObj = {seachField: 'searchMap', text: this.searchText.trim(), searchOption: this.searchMode};
    }
    console.log("queryObj, searchTextObj, this.limit", queryObj, searchTextObj, this.limit);
    if(this.searchText?.trim().length>=3 || this.dateRange.startDate){ // or dates selected
      this.viewMeetingResult = null;
      this.meetingsSubs$ = this.meeting.getMeetings(queryObj, searchTextObj, this.limit)
                            .subscribe(act=>{
                              let allMeetings = act.map((a: any) => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                const meetingStart = new Date(data.meetingStart?.seconds*1000);
                                const meetingEnd = data.meetingEnd?.seconds ? new Date(data.meetingEnd?.seconds*1000) : null;
                                // return {id, data: { ...data, startTime, endTime }};
                                return {id, data: {...data, meetingStart, meetingEnd }};
                              });
                              this.viewMeetingResult =[];
                              this.viewMeetingResult = allMeetings.sort((a:any,b:any)=>a.data.meetingStart-b.data.meetingStart)
                              console.log("activities", this.viewMeetingResult);
                            });
    }


  }

  onSelect(event){
    if(this.options.calendarOptions.pickMode=='single'){
      this.dateRange.startDate = new Date(event.time);
      this.dateRange.endDate = new Date(event.time + 24*60*60*1000);
      this.searchText ='';
      this.getMeetings();
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
      this.getMeetings();
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

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

  openMeetingDetails(meeting){
    this.router.navigate(['meeting/meeting-details'],{state: {data:{meeting: meeting}}});
  }
  showHideSearch(){
    this.showSearchModesforUpcomming=!this.showSearchModesforUpcomming;
    // re initialise all the serach variables
    this.limit = 20;
    this.options.calendarOptions.pickMode = 'single';
    this.cal.renderDataSet(this.options);
    this.searchMode = 'all';
    this.searchModeUser = 'user';
    this.searchText ='';
    this.dateRange = {
                        startDate: '',
                        endDate: ''
                      };
    if(!this.showSearchModesforUpcomming){
      this.getUpcommingMeetings();
    }
  }

}
