import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Meeting } from 'src/app/interface/meeting';
import { Risk } from 'src/app/interface/risk';
import { Task } from 'src/app/interface/task';
import { ComponentsService } from '../components/components.service';
import { DatabaseService } from '../database/database.service';
import { KpiService } from '../kpi/kpi.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SendEmailService } from '../send-email/send-email.service';
import { TextsearchService } from '../textsearch/textsearch.service';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  crud_action = {
    service:'',     // Meeting,Risk,Issue,Task
    type:'',        // create,update
    parentModule:'',//meeting,risk,issue,task
    header:'',      // header on page
    object:{},      // initiate object
  }
  passingObj = {
   // common to all
   title:'',
   startDate:'',
   startTime:'',
   endDate:'',
   endTime:'',
   selectedMembers:[],
   ownerId:{
     name:'',
     uid:'',
     subscriberId:'',
     picUrl:'',
     email:''
   },
   status:'',
   subscriberId:'',
   searchMap:null,
   tags: [],
   notes:'No notes added',
   agendas:'No agendas added',
   mitigation:'No mitigation added', //risk
   contingency:'No contingency added', //risk
   probability:'Medium',//risk
   impact:'Medium',//risk
   // use only for meeting
   eventSequenceId: 1,
   isOccurence : false,
   occurenceType: null,
   noOfOccurence: 1,
   weekdays: [false,true,true,true,true,true,false],
   meetingPlace: null,
   callList: '',
  }
  crud_action$ = new BehaviorSubject<any|undefined>(undefined);

  //searchService:string = '';
  search_action$ = new BehaviorSubject<any|undefined>(undefined);

  //shallow copy
  //const foo: TYPE = { ...e };


  refMeetingDetails:any= {};
  refMeetingNotiBAsic:any;

  detailsPagePasing$ = new BehaviorSubject<any|null>(undefined);

  constructor(
    private _db:DatabaseService,
    private _componentsService:ComponentsService,
    private _router:Router,
    private _searchMap:TextsearchService,
    private _senDmail:SendEmailService,
    private _notification:NotificationsService,
    private _kpi:KpiService
  ) { }


    transaction(orgProfile,passingData,creationData){
    let yearMonth = moment(passingData.startDate).format('YYYYMM');
    let noOfOccurence = passingData.noOfOccurence ? passingData.noOfOccurence : 1;
    let docRef = this._db.afs.collection(this._db.allCollections.subscribers).doc(orgProfile.subscriberId).ref;
    let eventId = null;
    let eventRef = null;
    let summaryId = null;
    let summaryRef = null;
    let eventsummaryId = null;
    let eventsummaryRef = null;
    // transaction provide here
    return this._db.afs.firestore.runTransaction(function(transaction) {
      return transaction.get(docRef).then(function(regDoc) {
          let subData = regDoc.data();
          let totalSequenceId = subData.totalSequenceId ? (subData.totalSequenceId + 1) : 1;
          // initialise the summary view object
          let increment = 0;
          let event = {...passingData, subscriberId: orgProfile.subscriberId,};
          if(event.noOfOccurence == 1 || event.occurenceType != 'daily'){
            // we do not require to save weekdays map
            event.weekdays = []
          }
          let monthlySummary: any = {
                                        subscriberId: orgProfile.subscriberId,
                                        eventSummary: {},
                                        yearMonth: yearMonth,
                                        };
          let eventAllSummary: any = {
                                        subscriberId: orgProfile.subscriberId,
                                        noOfOccurence: passingData.noOfOccurence,
                                        occurenceType: passingData.occurenceType,
                                        meetingTitle: passingData.title,
                                        eventId: totalSequenceId,
                                        // titleSearchMap: this.searchTextImplementation(),
                                        };
          for(let i=1; i<=noOfOccurence; i++){
            let eventDates = this.getEventStartAndEndDate(i,passingData);
            console.log("the procession date",eventDates);
            // create event document
            eventId = orgProfile.subscriberId + "_"+ (totalSequenceId +'_' + i);
            eventRef = this._db.afs.collection(this._db.allCollections.meetings).doc(eventId).ref;
            if(i==1){
              this.refMeetingDetails.meetingDocId = eventId;
              this.refMeetingNotiBAsic = {
                ...creationData,
                ...eventDates,
                eventSequenceId: i,
                eventId: totalSequenceId,
            //  titleSearchMap: this.searchTextImplementation(eventDates.startDateTime),
              status: 'OPEN', updatedAt: new Date(),
             };
            }
            let setDataObject = {
              ...creationData,
              ...eventDates,
              eventSequenceId: i,
              eventId: totalSequenceId,
          //  titleSearchMap: this.searchTextImplementation(eventDates.startDateTime),
            status: 'OPEN', updatedAt: new Date(),
            }

            this._db.setTransactDocument(transaction,eventRef,setDataObject,true);

          }
          this._db.setTransactDocument(transaction,docRef,{totalMeeting: totalSequenceId},true)
      }.bind(this));
    }.bind(this)).then(function() {
        this._componentsService.presentToaster("You have created event successfully");
        this.crud_action$.next(undefined);
        // let eventInfo = {
        //   origin: 'meetings',
        //   eventType: 'add',
        //   data: {
        //     id: this.meetingDetails.meetingDocId,
        //     ...this.meetingNotiBAsic
        //   },
        // };
        // this.notification.createNotifications(eventInfo);
        // this.kpi.updateKpiDuringCreation('Meeting',
        //                                   this.meetingDetails.pageOne.isOccurence ?
        //                                   this.meetingDetails.pageOne.noOfOccurence
        //                                   :
        //                                   1,
        //                                   this.navData);

         this._componentsService.hideLoader();
         this._router.navigate(['/meeting']);
    }.bind(this)).catch(function(error) {
         this._componentsService.presentAlert("Error", error);
         console.log("transection err",error);
         this._componentsService.hideLoader();
    }.bind(this));
  }

  getEventStartAndEndDate(sequence: number = 1,passingData){
    let startTime  = passingData.startTime;
    let endTime = passingData.endTime;
    let date = passingData.startDate;
    let startDateTime = new Date(startTime);
    let endDateTime = new Date(endTime);
    let year = moment(startDateTime).format('YYYY');
    let month = moment(startDateTime).format('MM');
    let yearMonth = moment(startDateTime).format('YYYYMM');

    let testingObj = {
    startTime:startTime,
    endTime:endTime,
    date:date,
    startDateTime:startDateTime,
    endDateTime:endDateTime,
    year:year,
    month:month,
    yearMonth:yearMonth
    }
    console.log("result ",testingObj)
    switch(passingData.isOccurence){
      case true:
        switch(passingData.occurenceType){
          case 'daily':
            // if we start the first instance in the middle of the dayMap, we need to add the day offset
            let sequenceOffset = 0;
            let dayMap=[];
            passingData.weekdays.forEach((d,i)=>{
              if(d){
                dayMap.push(i);
                sequenceOffset += parseInt(moment(startDateTime).format('e')) > i ? 1 : 0;
              }
            });
            let noOfWeekDays = dayMap.length;
            let week = Math.floor((sequence+sequenceOffset)/noOfWeekDays) - (((sequence+sequenceOffset)%noOfWeekDays)==0 ? 1 : 0);
            let day = dayMap[(((sequence+sequenceOffset)%noOfWeekDays)==0 ? noOfWeekDays: ((sequence+sequenceOffset)%noOfWeekDays)) - 1];

            startDateTime = new Date(moment(startDateTime).add(week,'weeks').day(day).valueOf());
            endDateTime = new Date(moment(endDateTime).add(week,'weeks').day(day).valueOf());
            // startDateTime = new Date(moment(startDateTime).add(sequence-1,'days').valueOf());
            // endDateTime = new Date(moment(endDateTime).add(sequence-1,'days').valueOf());
            year = moment(startDateTime).format('YYYY');
            month = moment(startDateTime).format('MM');
            yearMonth = moment(startDateTime).format('YYYYMM');
            break;
          case 'weekly':
            startDateTime = new Date(moment(startDateTime).add(sequence-1,'weeks').valueOf());
            endDateTime = new Date(moment(endDateTime).add(sequence-1,'weeks').valueOf());
            year = moment(startDateTime).format('YYYY');
            month = moment(startDateTime).format('MM');
            yearMonth = moment(startDateTime).format('YYYYMM');
            break;
          case 'fortnightly':
            startDateTime = new Date(moment(startDateTime).add((sequence-1)*2,'weeks').valueOf());
            endDateTime = new Date(moment(endDateTime).add((sequence-1)*2,'weeks').valueOf());
            year = moment(startDateTime).format('YYYY');
            month = moment(startDateTime).format('MM');
            yearMonth = moment(startDateTime).format('YYYYMM');
            break;
          case 'monthly':
            startDateTime = new Date(moment(startDateTime).add(sequence-1,'months').valueOf());
            endDateTime = new Date(moment(endDateTime).add(sequence-1,'months').valueOf());
            year = moment(startDateTime).format('YYYY');
            month = moment(startDateTime).format('MM');
            yearMonth = moment(startDateTime).format('YYYYMM');
            break;
          case 'quarterly':
            startDateTime = new Date(moment(startDateTime).add(sequence-1,'quarters').valueOf());
            endDateTime = new Date(moment(endDateTime).add(sequence-1,'quarters').valueOf());
            year = moment(startDateTime).format('YYYY');
            month = moment(startDateTime).format('MM');
            yearMonth = moment(startDateTime).format('YYYYMM');
            break;
        }
        return {meetingStart: startDateTime, meetingEnd: endDateTime, startDateTime, endDateTime, startTime, endTime, year, month, yearMonth};
      case false:
        return {meetingStart: startDateTime, meetingEnd: endDateTime, startDateTime, endDateTime, startTime, endTime, year, month, yearMonth};
    }
  }
  // set object risk,issue,task
  setServiceObject(serviceName,dataObject,orgProfile){
  let searchStrings = dataObject.title + ' ' +
                    dataObject.tags.join(' ') + ' ' +
                    (dataObject.ownerId.name ? dataObject.ownerId.name : '') + ' ' +
                    (dataObject.selectedMembers[0].name ? dataObject.selectedMembers[0].name : '') + ' ' +
                    'OPEN' + (serviceName == 'Risk'? dataObject.probability + ' ' + dataObject.impact + ' ' : ' ');

  if(serviceName == 'risk'){
    let returnObject:Risk = {
        riskTitle : dataObject.title,
        riskOwner : dataObject.selectedMembers[0],
        riskInitiationDate : new Date(dataObject.startDate),
        riskEntryDate : new Date(dataObject.startDate),
        targetCompletionDate : new Date(dataObject.endDate),
        actualCompletionDate: null,
        riskStatus: 'OPEN',
        lastUpdateDate: new Date(dataObject.startDate),
        subscriberId: orgProfile.subscriberId,
        latestComment:{
          author:'',
          comment:'',
          date:null,
          picUrl:'',
          totalComment:0
        },
        riskInitiator :dataObject.ownerId,
        tags:dataObject.tags,
        riskProbability :dataObject.probability,
        riskImpact:dataObject.probability,
        riskMitigation:dataObject.mitigation,
        riskContingency:dataObject.contingency,
        searchMap: this._searchMap.createSearchMap(searchStrings),
        ownerInitiatorUidList:[
                              dataObject.ownerId.uid,
                              dataObject.selectedMembers[0].uid
        ],
        }
        return returnObject;
  }else if(serviceName == 'task'){
    let returnObject:Task = {
        taskTitle : dataObject.title,
        taskOwner : dataObject.selectedMembers[0],
        taskInitiationDate : new Date(dataObject.startDate),
        taskEntryDate : new Date(dataObject.startDate),
        targetCompletionDate : new Date(dataObject.endDate),
        actualCompletionDate: null,
        taskStatus: 'OPEN',
        lastUpdateDate: new Date(dataObject.startDate),
        subscriberId: orgProfile.subscriberId,
        latestComment:{
          author:'',
          comment:'',
          date:null,
          picUrl:'',
          totalComment:0
        },
        taskInitiator :dataObject.ownerId,
        tags:dataObject.tags,
        taskProbability :dataObject.probability,
        taskImpact:dataObject.probability,
        taskDetails:dataObject.notes,
        searchMap: this._searchMap.createSearchMap(searchStrings),
        ownerInitiatorUidList:[
                              dataObject.ownerId.uid,
                              dataObject.selectedMembers[0].uid
        ],
        }
        return returnObject;
  }
}
 // add function risk/issue/task
 add_risk_issue_task(serviceName,dataObject,orgProfile)
  {
     this._componentsService.showLoader();
     let addObjectWill = this.setServiceObject(serviceName,dataObject,orgProfile,);

     console.log(serviceName,
      dataObject,
      orgProfile,
      this._db.allCollections[serviceName],
      addObjectWill);

     this._db.addDocument(this._db.allCollections[serviceName],addObjectWill)
     .then(data=>{
      // this.add_risk_linkage(data.id);
      this._componentsService.presentToaster(`You have ${serviceName} created successfully`);

      let eventInfo = {
        origin: this._db.allCollections[serviceName],
        eventType: 'add',
        data: {
          id: data.id,
          ...addObjectWill
        },
      };
      this._componentsService.hideLoader();
      // this._notification.createNotifications(eventInfo);

      let kpiServiceName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1)
      this._kpi.updateKpiDuringCreation(kpiServiceName,1,orgProfile);
      if(kpiServiceName == 'Risk') this._kpi.updateRiskMetrix(null,addObjectWill,orgProfile)

      // this.storage.remove('risk_type');
      // this.storage.remove('risk_linkage');

      this.sendMailFunc(serviceName,dataObject,orgProfile);
      this.crud_action$.next(undefined);
      this._router.navigate(['/'+serviceName]);
    }).catch(err=>{
      console.log(err);
      this._componentsService.hideLoader();
    });
    }

  // send email function
    sendMailFunc(serviceName,dataObject,orgProfile){
      let sendMailObj = {
        toEmail:dataObject.selectedMembers[0].email,
        toName: dataObject.selectedMembers[0].name,
        initiator:dataObject.ownerId.name,
        orgName: orgProfile.subscriberId,
        initationDate:moment(dataObject.startDate).format('MMM DD, YYYY'),
        targetCompletionDate:moment(dataObject.endDate).format('MMM DD, YYYY'),
        status:'OPEN'
      }
      if(serviceName == 'risk'){
        sendMailObj['riskTitle'] = dataObject.riskTitle;
        sendMailObj['probability'] = dataObject.probability;
        sendMailObj['impact'] = dataObject.impact;
        this._senDmail.sendCustomEmail(this._senDmail.newRiskMailPath,{})
      }else if(serviceName == 'issue'){}
      else{}
    }


    fetchAllServices(collectionName,objectFilter,textSearchObj: any = null){
    return this._db.getAllDocumentsSnapshotByQuery(collectionName,objectFilter,textSearchObj);
    }



}
