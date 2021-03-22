import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { SessionService } from '../session/session.service';
import { DatabaseService } from '../database/database.service';
import { ProjectService } from '../project/project.service';
import { ActivityService } from '../activity/activity.service';
import { TextsearchService } from '../textsearch/textsearch.service';
import { Activity } from '../../interface/activity';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  public effortsTemplate = {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0};

  constructor(
    public session: SessionService,
    public db: DatabaseService,
    public activityService: ActivityService,
    public projectService: ProjectService,
    public searchMap: TextsearchService,
  ) { }

  // callback function to process user summary data
  extractTimesheet(summeriesArray,weekStartDate, weekEndDate){
    // startDate, endDate
    // activity: {task.title, activity.name, details: [Mon:,Tue,Wed,Thu,Fri,Sat,Sun]}
    let yearMonth1 = moment(weekStartDate).format('YYYYMM');
    let yearMonth2 = moment(weekEndDate).format('YYYYMM');
    let timeSheet = [];
    if(summeriesArray){
      let weekdates = [];
      for(let i=0; i<=7; i++){
        weekdates.push(moment(weekStartDate).add(i,'d').format('YYYYMMDD'));
      }
      summeriesArray.forEach(summary=>{
        if([yearMonth1,yearMonth2].includes(summary.yearMonth)){
          weekdates.forEach(wd=>{
            // check if any entry exists for the date
            if(summary.details[wd]){
              let wddata = summary.details[wd];
              let wdActivities = Object.keys(summary.details[wd]);
              wdActivities.forEach(act=>{
                if(wddata[act]['project']){
                  let weekday = moment(wd,'YYYYMMDD').format('ddd');
                  const {activityId, name, effort, billingAmount, project} = wddata[act];
                  let wdEntry = {
                    project: {...project},
                    activity: {activityId, name},
                    efforts: {[weekday]: effort},
                    billingAmount: {[weekday]: billingAmount}
                  };
                  // console.log("timeSheet entries", wdEntry, timeSheet);
                  // Now check if it already exists in timesheet data array
                  let tsIdx = timeSheet.findIndex(t=>t.project.projectId == wdEntry.project.projectId && t.activity.activityId == wdEntry.activity.activityId);
                  if(tsIdx==-1){
                    wdEntry.efforts =  {...this.effortsTemplate,[weekday]: effort},
                    wdEntry.billingAmount = {...this.effortsTemplate, [weekday]: billingAmount}
                    timeSheet.push(wdEntry);
                  } else {
                    timeSheet[tsIdx].efforts = {...timeSheet[tsIdx].efforts, ...wdEntry.efforts};
                    timeSheet[tsIdx].billingAmount = {...timeSheet[tsIdx].billingAmount, ...wdEntry.billingAmount};
                  }
                }
              })

            }
          })
        }
      })
    }
    // console.log("timesheet", timeSheet);

    return timeSheet;

  }

  // validate wdEntry
  validateWdEntry(sessionInfo, start, finish, newActivities: any =[]){
      // let's first check whether there is any entry in the new activities being added
      let day = moment(start).format('ddd');
      let overlaps = newActivities.filter(act=>act.durations[day].start < finish && start < act.durations[day].finish);
      if(overlaps.length==0){
        // now check in the databse
        return this.activityService.checkRetroActivityDates(sessionInfo,start,finish);
      } else {
        // overlaps exists raise flag
        let message={
          nonConflictingActivity: false ,
          title: 'Warning',
          body: "It seems some other activities already added for the selected period for the activity you wish to create. Please check and try again."
        };
        return message;
      }
  }

  // save timesheet changes
  async saveTimesheet(sessionInfo,timeSheetData){
    // reference for nts data structure
    // nts = {
    //   project: {},
    //   activity: {},
    //   rate: 0,
    //   efforts: {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0},
    //   billingAmount: {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0},
    //   durations: {
    //                 Mon:{start:, finish: },
    //                 Tue:{start:, finish: },
    //                 Wed:{start:, finish: },
    //                 Thu:{start:, finish: },
    //                 Fri:{start:, finish: },
    //                 Sat:{start:, finish: },
    //                 Sun:{start:, finish: }
    //                }
    // };
    const { uid, subscriberId, picUrl, email, name } = sessionInfo.userProfile;
    let coordinates = await this.session.getCurrentPosition();
    if(coordinates){
      await timeSheetData.reduce(async (promise,nts)=>{
        // This line will wait for the last async function to finish.
        // The first iteration uses an already resolved Promise
        // so, it will immediately continue.
        await promise;
        // for each timesheet loop for efforts of each weekday
        // if we have effort >0 that means we have to create new activity
        let wd = Object.keys(nts.efforts);
        await wd.reduce(async (promise,day)=>{
          // This line will wait for the last async function to finish.
          // The first iteration uses an already resolved Promise
          // so, it will immediately continue.
          await promise;
          if(nts.efforts[day] > 0){
            // since effort is greater than zero, lets create the entries
            let locationObj = {
                latitude: coordinates.coords.latitude,
                longitude: coordinates.coords.longitude,
                altitude: coordinates.coords.altitude,
                accuracy: coordinates.coords.accuracy,
                altitudeAccuracy: coordinates.coords.altitudeAccuracy,
                heading: coordinates.coords.heading,
                speed: coordinates.coords.speed,
              };
          // create new activity
            let activityObj = {
                project: nts.project,
                activityId: nts.activity.activityId,
                name: nts.activity.name,
                rate: nts.rate*1, //forcing the number data type here
                locationStart: locationObj,
                locationComplete: locationObj,
                uid: uid,
                status: 'COMPLETE',
                subscriberId: subscriberId,
                startTime: nts.durations[day].start,
                endTime: nts.durations[day].finish,
                effort: nts.efforts[day],
                billingAmount: nts.efforts[day]*nts.rate*1,
                user: {
                  uid: uid,
                  name: name,
                  picUrl: picUrl,
                  email: email
                }
              };
              console.log("started createUserActivity",day);
              await this.activityService.createUserActivity(activityObj , sessionInfo);
              console.log("finised createUserActivity",day);
          }
        }, Promise.resolve());//end of effort loop
      }, Promise.resolve());//end of nts loop

      return {
        status: true,
        title: "Timesheet updated",
        body: "Timesheet changes saved successfully."
      };

    } else {
      return {
        status: false,
        title: "Warning",
        body: "Timesheet changes can not be saved. It seems location service is not activated or permission is not allowed. Please enable location service and try again."
      };
    }

  }
}
