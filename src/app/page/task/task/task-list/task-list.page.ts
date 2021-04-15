import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CalendarComponentOptions } from 'ion2-calendar';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { CalendarService } from 'src/app/shared/calendar/calendar.service';
import { TaskService } from 'src/app/shared/task/task.service';
import { Task } from 'src/app/interface/task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
@Autounsubscribe()
export class TaskListPage implements OnInit {

  @Input() viewMode: string = 'normal'; // Other options upcoming, linkage
  @Input() excludeList: any[]=[];
  @Output() onSelectTask = new EventEmitter<any>();
  // observables
  sessionSubs$;
  tasksSubs$;
  public showSearchModesforUpcomming: boolean = false;
  public sessionInfo: any;
  public searchText: string;
  public limit: any = 20;
  public searchMode: string = 'all';
  public searchModeUser: string = 'user';
  public options: any;
  public viewTaskResult: any = [];
  public dateRange:any = {
                            startDate: '',
                            endDate: ''
                          };
  public colorStack: any[];

  constructor(
    private router:Router,
    private session: SessionService,
    private cal: CalendarService,
    private task: TaskService
  ) {
    this.options = this.cal.getCalendarMeta();
    console.log("tasks this.options", this.options);
    this.sessionSubs$ = this.session.watch().subscribe(async value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid || this.sessionInfo?.subscriberId != value?.subscriberId){
        this.viewTaskResult = [];
        this.searchText = '';
        if(this.tasksSubs$ && this.tasksSubs$?.unsubscribe){
          this.tasksSubs$.unsubscribe();
          this.tasksSubs$ = undefined;
        }
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
      if( this.sessionInfo?.subscriberId && this.sessionInfo?.uid && this.viewMode=='upcoming' && !this.tasksSubs$){
        this.getUpcommingTasks();
      }
    });
  }

  ngOnInit() {
    this.cal.renderDataSet(this.options);
    if(this.viewMode=='upcoming' && this.sessionInfo?.subscriberId && this.sessionInfo?.uid){
      this.getUpcommingTasks();
    }
  }

  ionViewDidEnter(){
    if(this.viewMode=='upcoming' && this.sessionInfo?.subscriberId && this.sessionInfo?.uid){
      this.getUpcommingTasks();
    }
  }

  ngOnDestroy(){

  }

  getUpcommingTasks(){
    this.limit = null;
    this.dateRange = {
                        startDate: new Date(moment().format('YYYY-MM-DD')), //moment().subtract(1,'y').format('YYYY-MM-DD')
                        endDate: new Date(moment().add(7,'d').format('YYYY-MM-DD'))
                      };
    this.getTasks();
  }

  calendarOptionsChanged(e){
    let pickMode = e.detail.value;
    this.options.calendarOptions.pickMode = pickMode;
    this.cal.renderDataSet(this.options);
  }

  SearchOptionsChanged(e){
    this.searchMode = e.detail.value;
    // this.searchModeUser = 'all';
    this.getTasks();
  }

  SearchUserOptionsChanged(e){
    this.searchModeUser = e.detail.value;
    this.getTasks();
  }

  ionChange(e){
    this.dateRange = {
                        startDate: '',
                        endDate: ''
                      };
    this.getTasks();
  }

  onClear(e){
    this.viewTaskResult = [];
  }

  dateFormater(date,format){
    return moment(date).format(format ? format : "ll");
  }
  // search implement
  async getTasks(){
    let searchTextObj = null;
    let queryObj = [];
    if(this.tasksSubs$ && this.tasksSubs$?.unsubscribe){
      await this.tasksSubs$.unsubscribe();
    }

    queryObj = [{field: 'subscriberId',operator: '==', value: this.sessionInfo.subscriberId}];

    // if(this.searchModeUser=='user'){
    //   queryObj.push({field: 'ownerInitiatorUidList',operator: 'array-contains-any', value: [this.sessionInfo.uid]})
    // }
    if(!this.searchText?.trim() && this.searchModeUser=='user'){
      queryObj.push({field: 'ownerInitiatorUidList',operator: 'array-contains-any', value: [this.sessionInfo.uid]})
    } else if(this.searchText?.trim() && this.searchModeUser=='user'){
      queryObj.push({field: 'searchMap.'+this.sessionInfo.uid,operator: '==', value: true});
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
      this.viewTaskResult = null;
      this.tasksSubs$ = this.task.getTasks(queryObj, searchTextObj, this.limit)
                            .subscribe(act=>{
                              let allTasks = [];
                              act.forEach((a: any) => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                const taskInitiationDate = new Date(data.taskInitiationDate?.seconds*1000);
                                const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
                                const actualCompletionDate = data.actualCompletionDate?.seconds ? new Date(data.actualCompletionDate?.seconds*1000) : null;
                                let overdue =  data.taskStatus != 'RESOLVED' && new Date(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
                                let idx = this.excludeList.findIndex(em=>em.id==id);
                                // return {id, data: { ...data, startTime, endTime }};
                                if(idx==-1) {
                                  allTasks.push({id, data: {...data, taskInitiationDate, targetCompletionDate, actualCompletionDate },overdue});
                                }
                              });
                              // this.viewMeetingResult =[];
                              this.viewTaskResult = allTasks.sort((a:any,b:any)=>a.data.taskInitiationDate-b.data.taskInitiationDate)
                              console.log("tasks", this.viewTaskResult,this.excludeList);
                            });
    }


  }

  repopulateTaskList(){
    console.log("repopulateTaskList this.excludeList", this.excludeList);
    let allTasks = [];
    if(this.viewTaskResult){
      this.viewTaskResult.forEach((a: any) => {
        const data = a.data;
        const id = a.id;
        let idx = this.excludeList.findIndex(em=>em.id==id);
        // return {id, data: { ...data, startTime, endTime }};
        if(idx==-1) {
          const taskInitiationDate = data.taskInitiationDate?.seconds ? new Date(data.taskInitiationDate?.seconds*1000) : data.taskInitiationDate;
          const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : data.targetCompletionDate ? data.targetCompletionDate : null;
          allTasks.push({id, data: {...data, taskInitiationDate, targetCompletionDate }, overdue: a.overdue});
        }
      });
    }
    // this.viewMeetingResult =[];
    this.viewTaskResult = allTasks.sort((a:any,b:any)=>a.data.taskInitiationDate-b.data.taskInitiationDate)
  }

  onSelect(event){
    if(this.options.calendarOptions.pickMode=='single'){
      this.dateRange.startDate = new Date(event.time);
      this.dateRange.endDate = new Date(event.time + 24*60*60*1000);
      this.searchText ='';
      this.getTasks();
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
      this.getTasks();
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

  openTaskDetails(task){
    if(this.viewMode!='linkage'){
      this.router.navigate(['task/task-details'],{state: {data:{task: task}}});
    }
  }

  onLinkTask(m){
    this.excludeList.push(m);
    this.repopulateTaskList();
    this.onSelectTask.emit(m);
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
      this.getUpcommingTasks();
    }
  }

  gotoAddTask(){
    this.router.navigate(['task/create-task'])
  }

}
