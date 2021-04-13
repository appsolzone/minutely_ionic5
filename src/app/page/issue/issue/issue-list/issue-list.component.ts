import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CalendarComponentOptions } from 'ion2-calendar';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { CalendarService } from 'src/app/shared/calendar/calendar.service';
import { IssueService } from 'src/app/shared/issue/issue.service';
import { Issue } from 'src/app/interface/issue';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss'],
})
@Autounsubscribe()
export class IssueListComponent implements OnInit {

  @Input() viewMode: string = 'normal'; // Other options upcoming, linkage
  @Input() excludeList: any[]=[];
  @Output() onSelectIssue = new EventEmitter<any>();
  // observables
  sessionSubs$;
  issuesSubs$;
  public showSearchModesforUpcomming: boolean = false;
  public sessionInfo: any;
  public searchText: string;
  public limit: any = 20;
  public searchMode: string = 'all';
  public searchModeUser: string = 'user';
  public options: any;
  public viewIssueResult: any = [];
  public dateRange:any = {
                            startDate: '',
                            endDate: ''
                          };
  public colorStack: any[];

  constructor(
    private router:Router,
    private session: SessionService,
    private cal: CalendarService,
    private issue: IssueService
  ) {
    this.options = this.cal.getCalendarMeta();
    console.log("issues this.options", this.options);
    this.sessionSubs$ = this.session.watch().subscribe(async value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid || this.sessionInfo?.subscriberId != value?.subscriberId){
        this.viewIssueResult = [];
        this.searchText = '';
        if(this.issuesSubs$ && this.issuesSubs$?.unsubscribe){
          this.issuesSubs$.unsubscribe();
          this.issuesSubs$ = undefined;
        }
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
      if( this.sessionInfo?.subscriberId && this.sessionInfo?.uid && this.viewMode=='upcoming' && !this.issuesSubs$){
        this.getUpcommingIssues();
      }
    });
  }

  ngOnInit() {
    this.cal.renderDataSet(this.options);
    if(this.viewMode=='upcoming' && this.sessionInfo?.subscriberId && this.sessionInfo?.uid){
      this.getUpcommingIssues();
    }
  }

  ionViewDidEnter(){
    if(this.viewMode=='upcoming' && this.sessionInfo?.subscriberId && this.sessionInfo?.uid){
      this.getUpcommingIssues();
    }
  }

  ngOnDestroy(){

  }

  getUpcommingIssues(){
    this.limit = null;
    this.dateRange = {
                        startDate: new Date(), //moment().subtract(1,'y').format('YYYY-MM-DD')
                        endDate: new Date(moment().add(7,'d').format('YYYY-MM-DD'))
                      };
    this.getIssues();
  }

  calendarOptionsChanged(e){
    let pickMode = e.detail.value;
    this.options.calendarOptions.pickMode = pickMode;
    this.cal.renderDataSet(this.options);
  }

  SearchOptionsChanged(e){
    this.searchMode = e.detail.value;
    this.searchModeUser = 'all';
    this.getIssues();
  }

  SearchUserOptionsChanged(e){
    this.searchModeUser = e.detail.value;
    this.getIssues();
  }

  ionChange(e){
    this.dateRange = {
                        startDate: '',
                        endDate: ''
                      };
    this.getIssues();
  }

  onClear(e){
    this.viewIssueResult = [];
  }

  dateFormater(date,format){
    return moment(date).format(format ? format : "ll");
  }
  // search implement
  async getIssues(){
    let searchTextObj = null;
    let queryObj = [];
    if(this.issuesSubs$ && this.issuesSubs$?.unsubscribe){
      await this.issuesSubs$.unsubscribe();
    }

    queryObj = [{field: 'subscriberId',operator: '==', value: this.sessionInfo.subscriberId}];

    if(this.searchModeUser=='user'){
      queryObj.push({field: 'ownerInitiatorUidList',operator: 'array-contains-any', value: [this.sessionInfo.uid]})
    }
    if(this.dateRange.startDate){
      queryObj.push({field: 'targetCompletionDate',operator: '>=', value: this.dateRange.startDate});
    }
    if(this.dateRange.endDate){
      queryObj.push({field: 'targetCompletionDate',operator: '<=', value: this.dateRange.endDate});
    }
    if(this.searchText?.trim().length>=3){
      searchTextObj = {seachField: 'searchMap', text: this.searchText.trim(), searchOption: this.searchMode};
    }
    console.log("queryObj, searchTextObj, this.limit", queryObj, searchTextObj, this.limit);
    if(this.searchText?.trim().length>=3 || this.dateRange.startDate){ // or dates selected
      this.viewIssueResult = null;
      this.issuesSubs$ = this.issue.getIssues(queryObj, searchTextObj, this.limit)
                            .subscribe(act=>{
                              let allIssues = [];
                              act.forEach((a: any) => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                const issueInitiationDate = new Date(data.issueInitiationDate?.seconds*1000);
                                const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
                                const actualCompletionDate = data.actualCompletionDate?.seconds ? new Date(data.actualCompletionDate?.seconds*1000) : null;
                                let overdue =  data.issueStatus != 'RESOLVED' && new Date(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
                                let idx = this.excludeList.findIndex(em=>em.id==id);
                                // return {id, data: { ...data, startTime, endTime }};
                                if(idx==-1) {
                                  allIssues.push({id, data: {...data, issueInitiationDate, targetCompletionDate, actualCompletionDate },overdue});
                                }
                              });
                              // this.viewMeetingResult =[];
                              this.viewIssueResult = allIssues.sort((a:any,b:any)=>a.data.issueInitiationDate-b.data.issueInitiationDate)
                              console.log("issues", this.viewIssueResult,this.excludeList);
                            });
    }


  }

  repopulateIssueList(){
    console.log("repopulateIssueList this.excludeList", this.excludeList);
    let allIssues = [];
    if(this.viewIssueResult){
      this.viewIssueResult.forEach((a: any) => {
        const data = a.data;
        const id = a.id;
        let idx = this.excludeList.findIndex(em=>em.id==id);
        // return {id, data: { ...data, startTime, endTime }};
        if(idx==-1) {
          const issueInitiationDate = data.issueInitiationDate?.seconds ? new Date(data.issueInitiationDate?.seconds*1000) : data.issueInitiationDate;
          const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : data.targetCompletionDate ? data.targetCompletionDate : null;
          allIssues.push({id, data: {...data, issueInitiationDate, targetCompletionDate }});
        }
      });
    }
    // this.viewMeetingResult =[];
    this.viewIssueResult = allIssues.sort((a:any,b:any)=>a.data.issueInitiationDate-b.data.issueInitiationDate)
  }

  onSelect(event){
    if(this.options.calendarOptions.pickMode=='single'){
      this.dateRange.startDate = new Date(event.time);
      this.dateRange.endDate = new Date(event.time + 24*60*60*1000);
      this.searchText ='';
      this.getIssues();
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
      this.getIssues();
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

  openIssueDetails(issue){
    if(this.viewMode!='linkage'){
      this.router.navigate(['issue/issue-details'],{state: {data:{issue: issue}}});
    }
  }

  onLinkIssue(m){
    this.excludeList.push(m);
    this.repopulateIssueList();
    this.onSelectIssue.emit(m);
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
      this.getUpcommingIssues();
    }
  }

  gotoAddIssue(){
    this.router.navigate(['issue/create-issue'])
  }

}
