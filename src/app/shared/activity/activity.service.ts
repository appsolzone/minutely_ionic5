import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';
import { DatabaseService } from '../database/database.service';
import { ProjectService } from '../project/project.service';
import { TextsearchService } from '../textsearch/textsearch.service';
import { Activity } from '../../interface/activity';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  newActivityStream$ = new BehaviorSubject<any|undefined>(undefined);
  public newActivity = {
      project: '',
      activityId: '',
      name: '',
      rate: 0,
      locationStart: {},
      locationComplete: {},
      uid: '',
      status: 'ACTIVE',
      subscriberId: '',
      startTime: this.db.frb.firestore.FieldValue.serverTimestamp(),
      endTime: null,
      user: {
        uid: '',
        name: '',
        picUrl: '',
        email: ''
      }
    }

  constructor(
    public db: DatabaseService,
    public projectService: ProjectService,
    public searchMap: TextsearchService,
  ) {
    this.newActivityStream$.next(undefined);
  }

  // observable methods
  watch() { return this.newActivityStream$; }
  peek() { return this.newActivityStream$.value; }
  patch(t){ const newActivityStream = Object.assign({}, this.peek() ? this.peek() : {}, t); this.poke(newActivityStream);}
  poke(t) { this.newActivityStream$.next(t); }
  clear() { this.poke(undefined); }


  // Read
  getActivitiesOnce(queryObj:any[], textSearchObj: any = null, limit: number=null){
    return this.db.getAllDocumentsByQuery(this.db.allCollections.activities, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getActivities(queryObj:any[], textSearchObj: any = null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.activities, queryObj, textSearchObj);
  }
  getActivitiesSummary(queryObj:any[], textSearchObj: any = null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.userSummary, queryObj, textSearchObj);
  }

  // write
  async createUserActivity(activity, sessionInfo){
      // if we have the project data then no need to create any project
      let project :any; // this is partial project object
      if(!activity.project.projectId && !activity.activityId){
        // both project and activity does not exist
        let projObj = {
              title: activity.project.title,
              activities: [{name: activity.name, status: 'OPEN'}]
            };
        let createdprojObj = await this.projectService.createProject(projObj, sessionInfo);
        project = { projectId: createdprojObj.projectId, title: createdprojObj.title};
        activity.activityId = createdprojObj.activities[0].activityId;
      } else if(activity.project.projectId && !activity.activityId){
        let actObj = {
              projectId: activity.project.projectId,
              name: activity.name, status: 'OPEN'
            };
        let createdactObj = await this.projectService.createProjectActivity(actObj, sessionInfo);
        activity.activityId = createdactObj.activity.activityId;
        project = activity.project;
      } else {
        project = activity.project;
      }

      let {uid,subscriberId} = sessionInfo;
      let activityObj = {
                            ...activity,
                            subscriberId,
                            uid,
                            project,
                            searchMap: this.searchMap.createSearchMap(project.title + ' ' + activity.name + ' ' + activity.status + ' ' + activity.user.name),
                        };
      if(activityObj.status=='COMPLETE'){
        // This is a retro activity to be created so ensure that data augmentation happens
        // TBA ===>  moment().valueOf() - this.session.admin.timeOffset
        let actRef = await this.db.generateDocuemnetRef(this.db.allCollections.activities); //'R'+activityObj.activityId+(moment().valueOf()).toString(); //taking unix time to make it unique
        activityObj.status = 'ACTIVE'; // since we have to create ugmented data
        await this.logActivitySummary('COMPLETE', { actRef: actRef, data: activityObj } , sessionInfo, null);
        return {...activityObj,status: 'COMPLETE'};
      }
      // check whether any activity is already running, this is to ensure that no activity is started while another activity is running
      let queryObj = [{field: 'subscriberId',operator: '==', value: subscriberId},
                      {field: 'uid',operator: '==', value: uid},
                      {field: 'status',operator: '==', value: 'ACTIVE'}
                    ];
      await this.getActivitiesOnce(queryObj,null,1).then(runningActivity=>{
        let data = [];
        runningActivity.forEach((doc)=>{
          data.push(doc.data());
        });
        if(data.length > 0){
          throw { body: "New activity can not be started as there exists ongoing activity. Please check and try again."};
        } else {
          console.log("runningActivity else part", runningActivity);
          return this.db.afs.collection(this.db.allCollections.activities).add(activityObj)
                            .then(res=>{
                              let id = res.id;
                              return {id, ...activityObj};
                            });
        }
      });
    }

    checkRetroActivityDates(sessionInfo,startTime,endTime){
      // validate if there is another project in the time zone
      const { uid, subscriberId } = sessionInfo;
      let data = [];
      let message={ nonConflictingActivity: true , title: 'Information', body: 'No conflicting activity found'};

      let queryObj = [
            { field: 'uid', operator: '==', value: uid },
            { field: 'subscriberId', operator: '==', value: subscriberId },
            { field: 'startTime', operator: '>=', value: startTime },
            { field: 'startTime', operator: '<=', value: endTime },
          ];
      // this.session.user.loader = true;
      return this.getActivitiesOnce(queryObj, null, 1)
        .then((querySnapshot)=>{
          querySnapshot.forEach((doc)=>{
            data.push(doc.data());
          });
          if(data.length > 0){
            message={
              nonConflictingActivity: false ,
              title: 'Warning',
              body: "It seems some other activities exist during the selected period for the activity you wish to create. Please check and try again. You may wish to check existing activities from Activities -> Search activities."
            };

            return message;
          }else{
            queryObj = [
                  { field: 'uid', operator: '==', value: uid },
                  { field: 'subscriberId', operator: '==', value: subscriberId },
                  { field: 'endTime', operator: '>=', value: startTime },
                  { field: 'endTime', operator: '<=', value: endTime },
                ];
            return this.getActivitiesOnce(queryObj, null, 1)
              .then((querySnapshot)=>{
                querySnapshot.forEach((doc)=>{
                  data.push(doc.data());
                });
                if(data.length > 0){
                  message={
                    nonConflictingActivity: false ,
                    title: 'Warning',
                    body: "It seems some other activities exist during the selected period for the activity you wish to create. Please check and try again. You may wish to check existing activities from Activities -> Search activities."
                  };
                  return message;
                }else{
                  queryObj = [
                        { field: 'uid', operator: '==', value: uid },
                        { field: 'subscriberId', operator: '==', value: subscriberId },
                        { field: 'startTime', operator: '>=', value: new Date(moment(startTime).format('YYYY-MM-DDT00:00')) },
                        { field: 'startTime', operator: '<=', value: new Date(moment(startTime).format('YYYY-MM-DDT23:59')) },
                      ];
                    return this.getActivitiesOnce(queryObj, null, 1)
                      .then((querySnapshot)=>{
                        querySnapshot.forEach((doc)=>{
                          data.push(doc.data());
                        });
                        if(data.length > 0){
                          let conflicts = data.filter(act=>{
                            let start = new Date(act.startTime.seconds*1000);
                            let end = new Date(act.endTime?.seconds*1000);
                            // console.log("data2", (start <= startTime && end >= endTime) , (start <= endTime && act.status == 'ACTIVE'), start, end);
                            return (start <= startTime && end >= endTime) || (start <= endTime && act.status == 'ACTIVE');
                          })
                          // console.log("data2", conflicts);
                          if(conflicts.length>0){
                            message={
                              nonConflictingActivity: false ,
                              title: 'Warning',
                              body: "It seems some other activities exist during the selected period for the activity you wish to create. Please check and try again. You may wish to check existing activities from Activities -> Search activities."
                            };
                            return message;
                          } else{
                            return message;
                          }

                        }else{
                          return message;
                        }
                  }).catch((err)=>{
                    message={
                      nonConflictingActivity: false ,
                      title: 'Error',
                      body: "There seems to be an issue during validating dates for the activity. Please try again."
                    };
                    return message;
                  });
                }
              }).catch((err)=>{
                message={
                  nonConflictingActivity: false ,
                  title: 'Error',
                  body: "There seems to be an issue during validating dates for the activity. Please try again."
                };
                return message;
              });
          }
        }).catch((err)=>{
          message={
            nonConflictingActivity: false ,
            title: 'Error',
            body: "There seems to be an issue during validating dates for the activity. Please try again."
          };
          return message;
        });
    }

    logActivitySummary(event:string='PAUSE',activityObj, sessionInfo, delta:any=null){
      // If its a pause event then just calculate the Summary and change the endTime and status as paused
      // else if it is a COMPLETE event then
      //      if current status == PAUSED then just change status to COMPLETE
      //      else augment summary and change the endTime and status as COMPLETE
      // else if it is RESUME event then mark the last activity as COMPLETE and create a duplicate activity using ref activity with status ACTIVE
      // if its an UPDATE activity the delta should be supplied along with the activity {effort:, billingAmount:}
      let activity = activityObj.data;
      let id = activityObj.id;
      let {subscriberId, uid, name, picUrl} = sessionInfo;
      switch(event){
        case 'PAUSE':
          // If its a pause event then just calculate the Summary and change the endTime and status as paused
          activity.status = 'PAUSE';
          return this.processPauseActivity(activityObj, sessionInfo);
          break;
        case 'COMPLETE':
          // else if it is a COMPLETE event then
          //      if current status == PAUSED then just change status to COMPLETE
          //      else augment summary and change the endTime and status as COMPLETE
          if(activity.status=='ACTIVE'){
            activity.status = 'COMPLETE';
            return this.processPauseActivity(activityObj, sessionInfo);
          } else {
            let actRef = id ?
                          this.db.afs.collection(this.db.allCollections.activities).doc(id).ref
                          :
                          activityObj.actRef.ref;
            activity.status = 'COMPLETE';
            return actRef.set({...activity,
                        searchMap: this.searchMap.createSearchMap(activity.project.title + ' ' + activity.name + ' ' + activity.status + ' ' + activity.user.name),
                      },{merge: true});
          }
          break;
        case 'RESUME':
          // else if it is RESUME event then mark the last activity as COMPLETE and create a duplicate activity using ref activity with status ACTIVE
          return this.processResumeActivity(activityObj, sessionInfo);
          break;
        case 'UPDATE':
          // if its an UPDATE activity the delta should be supplied along with the activity {effort:, billingAmount:}
      }


    }

    async processPauseActivity(activityObj, sessionInfo){
      // If its a pause event then just calculate the Summary and change the endTime and status as paused
      // augmented summary to be calculated
      // user view:
      //  1. Monthly data => calendar month avrg effort, total billing amount
      // Admin view:
      //  1. Who is working on what NOW
      //  2. Temamber contributions for a preiod/date
      //  3. Team contribution for a project
      //  4. Team contribution for a project for a period
      // Project view:
      // Team View:
      // Activity view:
      //  1. Who all contributed towards the activity
      //  2. Who all contributed towrads the activity for a period
      // Effort view:
      // Cost view:
      let activity = activityObj.data;
      let id = activityObj.id;
      let {subscriberId, uid, name, picUrl, email } = sessionInfo.userProfile;
      // if date is from firestore database then it'll have secods,
      // however if its a backdated entry then it will be a javascript date object
      let startTime = activity.startTime.seconds ?
                      moment(activity.startTime.seconds*1000)
                      :
                      moment(activity.startTime);
      let day = moment(startTime).format('YYYYMMDD');
      let yearMonth = moment(startTime).format('YYYYMM');
      let year = moment(startTime).format('YYYY');
      let month = moment(startTime).format('MM');
      let docId = subscriberId+uid+yearMonth;
      // console.log("docId", docId, startTime, yearMonth, day);
      let userSumRef = await this.db.afs.collection(this.db.allCollections.userSummary).doc(docId).ref;

      let projectsRef = await this.db.afs.collection(this.db.allCollections.projects).doc(subscriberId+activity.project.projectId).ref;

      let projectYearlySummary = await this.db.afs.collection(this.db.allCollections.projectSummary).doc(subscriberId+"_"+activity.project.projectId+"_"+year).ref;
      return this.db.afs.firestore.runTransaction((transaction)=>{
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(projectYearlySummary).then(async (sfDoc)=>{

          // project summary
          // ! get the item information
          // console.log(activity);

          let projectSummary = sfDoc.data();
          if(!projectSummary){
            projectSummary = {
              subscriberId: subscriberId,
              projectId: activity.project.projectId, // need to check here
              title: activity.project.title, // need to check here
              year: year, //moment().format("YYYY"),
              effort: 0,
              billingAmount: 0,
              months: {[month]: {effort:0, billingAmount:0}},
              activities: {[activity.activityId]: {name: activity.name, effort:0, billingAmount: 0}}
            };
          } else{
            if(!projectSummary.months[month]){
              projectSummary.months[month] = {effort:0, billingAmount:0};
            }
            if(!projectSummary.activities[activity.activityId]){
              projectSummary.activities[activity.activityId] = {name: activity.name, effort:0, billingAmount: 0};
            }

          }
          projectSummary.billingAmount += activity.billingAmount;
          projectSummary.effort += activity.effort;
          projectSummary.months[month].billingAmount += activity.billingAmount;
          projectSummary.months[month].effort += activity.effort;
          projectSummary.activities[activity.activityId].billingAmount += activity.billingAmount;
          projectSummary.activities[activity.activityId].effort += activity.effort;

          const smDoc = await transaction.get(userSumRef);
          let userSummary = smDoc.data();

          if(!smDoc.exists){
            // no document exist so initialise one here
            userSummary = {subscriberId, uid, name, picUrl, email, yearMonth,year,month,
                               effort:0, billingAmount:0,
                               projects:{}, activities:{},
                               details:{[day]:{effort:0, billingAmount: 0}}
                             };
          };
          userSummary.effort +=activity.effort;
          userSummary.billingAmount +=activity.billingAmount;
          if(userSummary.projects[activity.project.projectId]?.effort){
            userSummary.projects[activity.project.projectId].effort +=activity.effort;
            userSummary.projects[activity.project.projectId].billingAmount +=activity.billingAmount;
          } else {
            let projectObj = {worked:true, effort: activity.effort, billingAmount: activity.billingAmount, title: activity.project.title}
            Object.assign(userSummary.projects,{[activity.project.projectId]: projectObj});
          }
          if(userSummary.activities[activity.activityId]?.effort){
            userSummary.activities[activity.activityId].effort +=activity.effort;
            userSummary.activities[activity.activityId].billingAmount +=activity.billingAmount;
          } else {
            let activityObj = {worked:true, effort: activity.effort, billingAmount: activity.billingAmount, name: activity.name, title: activity.project.title}
            Object.assign(userSummary.activities,{[activity.activityId]: activityObj});
          }


          // Now check if the day already added, if not then initialise day
          if(!userSummary.details[day]){
            // document exists but day may not be existing so add it
            userSummary.details[day] = {effort:activity.effort, billingAmount: activity.billingAmount};
          } else if(userSummary.details[day]){
            userSummary.details[day].effort +=activity.effort;
            userSummary.details[day].billingAmount +=activity.billingAmount;
          }

          if(userSummary.details[day][activity.activityId]){
            userSummary.details[day][activity.activityId].effort +=activity.effort;
            userSummary.details[day][activity.activityId].billingAmount +=activity.billingAmount;
          } else {
            let activityObj = {
              [activity.activityId]:{
                project: activity.project,
                activityId: activity.activityId,
                name: activity.name,
                effort: activity.effort,
                billingAmount: activity.billingAmount,
              }
            };
            Object.assign(userSummary.details[day],activityObj)
          }

          const prjDoc = await transaction.get(projectsRef);
          let projectData = prjDoc.data();
          // projectData effort is zero if the billing is zero, which means its non billable effort - ON HOLD
          projectData.totalEffort += activity.effort; //(activity.billingAmount==0 ? 0 : activity.effort);
          projectData.totalBillableAmount +=activity.billingAmount;


          let actRef = id ?
                        this.db.afs.collection(this.db.allCollections.activities).doc(id).ref
                        :
                        activityObj.actRef.ref;
          transaction.set(actRef,{...activity,
                      searchMap: this.searchMap.createSearchMap(activity.project.title + ' ' + activity.name + ' ' + activity.status + ' ' + activity.user.name),
                    },{merge: true});

          // now set the augmented user summary data
          transaction.set(userSumRef,userSummary,{merge: true});
          // now set the augmented projects actual data
          transaction.set(projectsRef,projectData,{merge: true});
          // set yearly project summary
          transaction.set(projectYearlySummary,projectSummary,{merge: true});
        });
      });
    }

    processResumeActivity(activityObj, sessionInfo){
      let activity = activityObj.data;
      let id = activityObj.id;
      const { uid, subscriberId, name, picUrl, email } = sessionInfo.userProfile;
      let actRef = this.db.afs.collection(this.db.allCollections.activities).doc(id).ref;
      activity.status = 'COMPLETE';
      return actRef.set({...activity,
                  searchMap: this.searchMap.createSearchMap(activity.project.title + ' ' + activity.name + ' ' + activity.status + ' ' + activity.user.name),
                },{merge: true})
                .then((res)=>{
                  let newActivityObj = {
                      project: activity.project,
                      activityId: activity.activityId,
                      name: activity.name,
                      rate: activity.rate,
                      locationStart: activity.locationComplete,
                      locationComplete: {},
                      uid: uid,
                      status: 'ACTIVE',
                      subscriberId: subscriberId,
                      startTime: new Date(moment().valueOf()), //TBA - this.session.admin.timeOffset), //firebase.firestore.FieldValue.serverTimestamp(),
                      endTime: '',
                      user: {
                        uid: uid,
                        name: name,
                        picUrl: picUrl,
                        email: email
                      }
                    };
                  return this.createUserActivity(newActivityObj, sessionInfo);
                });
    }

}
