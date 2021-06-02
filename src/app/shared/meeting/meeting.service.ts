import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DatabaseService } from 'src/app/shared/database/database.service';
import { TextsearchService } from 'src/app/shared/textsearch/textsearch.service';
import { LinkageService } from 'src/app/shared/linkage/linkage.service';
import { MinutelyKpiService } from 'src/app/shared/minutelykpi/minutelykpi.service';
import { KpiService } from 'src/app/shared/kpi/kpi.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { ItemUpdatesService } from 'src/app/shared/item-updates/item-updates.service';
import { SendEmailService } from 'src/app/shared/send-email/send-email.service';
import { Meeting } from 'src/app/interface/meeting';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  public newMeeting = {
      meetingTitle:'',
      meetingStart:null,
      meetingEnd:null,
      status:'OPEN',
      subscriberId:'',
      ownerId: {
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      meetingPlace: '',
      callList:'',
      tags:[],

      attendeeList:[],
      attendeeUidList:[],
      notes:'',
      agendas:'',
      searchMap:{},

      eventSequenceId: 1,
      isOccurence:false,
      occurenceType:'daily',
      noOfOccurence:1,
      weekdays:[false, false, false, false, false, false, false],
      eventId: null,
      updatedAt: null,
    }

  constructor(
    public db: DatabaseService,
    public searchMap: TextsearchService,
    public link: LinkageService,
    public kpi: MinutelyKpiService,
    public aclKpi: KpiService,
    public notification: NotificationsService,
    public itemupdate: ItemUpdatesService,
    public sendmail: SendEmailService,
  ){
     // TBA
  }

  // Read
  getMeetingsOnce(queryObj:any[], textSearchObj: any = null, limit: number=null){
    return this.db.getAllDocumentsByQuery(this.db.allCollections.meeting, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getMeetings(queryObj:any[], textSearchObj: any = null, limit: any=null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.meeting, queryObj, textSearchObj, limit);
  }
  // Read and watch
  getMeetingById(id: string){
    return this.db.getDocumentSnapshotById(this.db.allCollections.meeting, id);
  }

  // validate basic info functions
  validTitle(m){
    let meeting = m.data;
    let status = true;
    let title = "Meeting title";
    let body = "";
    if(meeting.meetingTitle && meeting.meetingTitle.trim()){
      status = true;
    } else {
      body = "Please enter a valid meeting title and try again.";
      status=false;
    }
    return {status, title, body};
  }

  dateChange(m, refInformation){
    let meeting = m.data;
    let title='Meeting Date';
    let body='';
    let status = true;
    let startDateTime = meeting.meetingStart ? new Date(meeting.meetingStart) : null;
    let endDateTime = meeting.meetingEnd ? new Date(meeting.meetingEnd) : null;
    let isValidStartDate = startDateTime &&
                           (
                             !meeting.isOccurence ||
                             !refInformation.toCascadeChanges ||
                              (meeting.occurenceType!='daily'
                                ||
                                (meeting.occurenceType=='daily'
                                 && meeting.weekdays[parseInt(moment(startDateTime).format('e'))]
                                 )
                              )
                            );

    if(!startDateTime) {
      status = false;
      title = "Invalid Meeting Start Date";
      body = "Meeting start date cannot be empty. The meeting start time should be future time.";
    } else if(!endDateTime) {
      status = false;
      title = "Invalid Meeting End Date";
      body = "Meeting end date cannot be empty. The meeting end time should be future time.";
    } else if((refInformation.meetingStart == meeting.meetingStart && refInformation.meetingEnd == meeting.meetingEnd && isValidStartDate) ||
              (new Date() <= startDateTime && new Date() <= endDateTime && isValidStartDate)
            ) {
      status = true;
    } else {
       if(!isValidStartDate){
           title = "Invalid Meeting Start Date";
           body = "Meeting start date should be on one of the weekdays selected for the meeting frequency. Please check and try again.";
           status = false;
        } else {
          title = "Invalid Meeting Dates";
          body = "Meeting cannot be set in past. The meeting start and end time should be future time.";
          status= false;
       }

    }
    return {status, title, body};
  }

  validRecurringMeeting(m){
    let meeting = m.data;
    const {isOccurence, noOfOccurence, occurenceType, weekdays} = meeting;
    let status = true;
    let title = "Recurring meeting";
    let body = "";
    if(!isOccurence){
      status = true;
    } else {
      if(!noOfOccurence){
        status = false;
        body = "Please provide total no of meetings for the recurring meeting and try again."
      } else{
        switch(occurenceType){
          case 'daily':
            let weekdaysSelected = 0;
            weekdays.forEach(w=>{if(w){weekdaysSelected++}});
            if(!weekdays || weekdaysSelected==0){
              status = false;
              body = "Please select at least one week day for the daily recurring meeting and try again."
            }
            break;
          case 'weekly':
            break;
          case 'fortnightly':
            break;
          case 'monthly':
            break;
          case 'quarterly':
            break;
          default:
            status = false;
            body = "No meeting frequency is selected for the recurring meeting. Please select one of the options and try again."
            break;
        }
      }
    }
    return {status, title, body};
  }

  // This function check kpi free acl limit for a feature
  isKpiAclLimitExhausted(m,mRef, sessionInfo){
    const {aclFreeLimitKpi} = sessionInfo;
    let meeting = m.data;
    const {isOccurence, noOfOccurence, occurenceType, weekdays} = meeting;
    let status = true;
    let title = "Usage Limit";
    let body = "";

    const feature = aclFreeLimitKpi['create-meeting'];
    const freeLimit = feature?.freeLimit!=null ?  feature?.freeLimit : -1;
    const usedLimit = feature?.usedLimit!=null ?  feature?.usedLimit : 0;
    const isWithinLimit = freeLimit == -1 ? true : freeLimit > (usedLimit + noOfOccurence - mRef.noOfOccurence ? mRef.noOfOccurence : 0);
    console.log('isWithinKpiAclLimit', isWithinLimit, feature);
    if (!isWithinLimit){
      status = false;
      body = 'Please note that you are trying to create meetings beyound the allowed number of meetings for the current subscription plan.' +
             ' Allowed : ' + freeLimit + ', already used : ' + usedLimit + ', no of new meetings trying to create : ' + noOfOccurence + '. ' +
             ' Please upgrade your plan to continue creating meetings along with other features of Minutely.';
      title = "Usage Limit Exhausted";
    }
    return {status, title, body};
  }

  validateBasicInfo(meeting, refInformation, sessionInfo){

    let check = this.dateChange(meeting,refInformation);

    if(!check.status){
      return check;
    }

    check = this.validTitle(meeting);

    if(!check.status){
      return check;
    }

    check = this.validRecurringMeeting(meeting);

    if(!check.status){
      return check;
    }

    check = this.isKpiAclLimitExhausted(meeting, refInformation, sessionInfo);

    if(!check.status){
      return check;
    }

    return {status: true, title: 'Valid Basic Info', body: 'Valid Basic Info'};

  }

  processMeeting(meeting, refInformation, editedlinkages, sessionInfo){
    // if meeting is cancelled, just change the status to cancel

    // if changes are confined only to this instance, not be propagated, copy referenceInfomation for recurrence, if any

    // else changes to be propagated
    let meetingData = meeting.data;
    let type = meeting.id ? 'update' : 'new';
    return this.transaction(meetingData, refInformation, editedlinkages, sessionInfo, type, false);
  }

  getEventStartAndEndDate(sequence: number = 1, isOccurence: boolean = false, refDetails: any = {}, type: any = 'update'){
    let startTime  = refDetails.startTime;
    let endTime = refDetails.endTime;
    let date = refDetails.date;
    let startDateTime = new Date(refDetails.meetingStart);
    let endDateTime = new Date(refDetails.meetingEnd);
    let year = moment(startDateTime).format('YYYY');
    let month = moment(startDateTime).format('MM');
    let yearMonth = moment(startDateTime).format('YYYYMM');

    switch(isOccurence){
      case true:
        if(['clean','cancel'].includes(type)){
          // Do nothing as we just need to refer to the reference data
        } else {
          switch(refDetails.occurenceType){
            case 'daily':
              // if we start the first instance in the middle of the dayMap, we need to add the day offset
              let sequenceOffset = 0;
              let dayMap=[];
              refDetails.weekdays.forEach((d,i)=>{
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
        }
        return {meetingStart: startDateTime, meetingEnd: endDateTime} //, startDateTime, endDateTime, startTime, endTime, year, month, yearMonth};
      case false:
        return {meetingStart: startDateTime, meetingEnd: endDateTime} //, startDateTime, endDateTime, startTime, endTime, year, month, yearMonth};
    }
  }

  searchTextImplementation(meeting){
    let status = meeting.status;
    let searchMap: any;

    let searchStrings = meeting.meetingTitle +" "+
                        meeting.tags.join(' ') +' ' +
                        meeting.attendeeList.map(u=>u.name + ' ' + u.email).join(' ') + " " +
                        status+" ";
      searchStrings += moment(new Date(meeting.meetingStart)).format("D") + " "+
                        moment(new Date(meeting.meetingStart)).format("YYYY") + " "+
                        moment(new Date(meeting.meetingStart)).format("MMMM") + " " +
                        moment(new Date(meeting.meetingStart)).format("MMM");
    searchMap = this.searchMap.createSearchMap(searchStrings);
    meeting.attendeeUidList.forEach(uid=>{if(uid)searchMap[uid]=true;});
    return searchMap;
  }

  transaction(meeting, refCopy, editedlinkages, sessionInfo, type, silentMode: boolean = false){
    const {subscriberId, uid}= sessionInfo;
    // we are handling type = 'update' && 'new' only
    let refEventSequenceId = meeting.eventSequenceId;
    // No of occurences is more than one if we have cascade flag true
    let noOfOccurence = meeting.noOfOccurence;
    let toCascadeChanges = refCopy.toCascadeChanges;
    // let's lock the document we would like to create readlock
    let docId = subscriberId;
    let docRef = this.db.afs.collection(this.db.allCollections.subscribers).doc(docId).ref;
    let eventId = null;
    let eventRef = null;
    // transaction provide here
    return this.db.afs.firestore.runTransaction(function(transaction) {
      // get the read consistency lock on the subscriber doc
      return transaction.get(docRef).then(async function(regDoc) {
          let subscriber = regDoc.data();
          let totalSequenceId = type=='new' ?
                                (subscriber.totalMeeting ? (subscriber.totalMeeting + 1) : 1)
                                :
                                meeting.eventId;
          // initialise the summary view object
          let event = {...meeting};
          // Get the minutelyKpi details
          let widgetData: any = {};
          let rlDocRef = this.db.afs.collection(this.db.allCollections.minutelykpi).doc(subscriberId).ref;
          await transaction.get(rlDocRef).then(doc=>{
            console.log("minutley kpi data doc", doc.id, doc.data())
            widgetData = doc.data();
          });
          // Note that we should start at the current event seq id to cascade the meetings
          for(let i=refEventSequenceId; i<=(toCascadeChanges ? noOfOccurence : refEventSequenceId); i++){
            console.log("runninh transaction", i);
            let eventDates = this.getEventStartAndEndDate((i-refEventSequenceId+1), meeting.isOccurence,
                                                          this.status=='CANCEL' ? refCopy : meeting,
                                                          type);

            eventId = subscriberId + "_"+ (totalSequenceId +'_' + i);
            eventRef = this.db.afs.collection(this.db.allCollections.meeting).doc(eventId).ref;
            if(type=='new' && i==1 && !refCopy.id){
              refCopy.id = eventId;
            }
            console.log("runninh transaction", eventId);
            let dataToSave = meeting.status!='CANCEL' ?
                            {...event, ...eventDates, eventSequenceId: i, eventId: totalSequenceId,
                                     // date: moment(eventDates.startDateTime).format('YYYY-MM-DD'),
                                     searchMap: this.searchTextImplementation({...event, ...eventDates, eventSequenceId: i, eventId: totalSequenceId,}),
                                     // status: type,
                                     updatedAt: new Date(),
                                   }
                            :
                            {status: meeting.status, //...eventDates, eventSequenceId: i, eventId: totalSequenceId,
                                     // date: moment(eventDates.startDateTime).format('YYYY-MM-DD'),
                                     searchMap: this.searchTextImplementation({...refCopy, status: meeting.status}),
                                     // status: type,
                                     updatedAt: new Date(),
                                   };
            // Propagate linkage only if linkage propagation is true along with other propagation options
            let linkage = meeting.status!='CANCEL' && ((!toCascadeChanges && i==refEventSequenceId) || (toCascadeChanges)) ? // && this.toCascadeChanges && this.toCascadeLinakges)) ?
                            {
                              meetings:editedlinkages.meetings ? editedlinkages.meetings : [],
                              risks: editedlinkages.risks ? editedlinkages.risks : [],
                              tasks: editedlinkages.tasks ? editedlinkages.tasks : [],
                              issues: editedlinkages.issues ? editedlinkages.issues : []
                            }
                          :
                          {
                            meetings:[],
                            risks: [],
                            tasks: [],
                            issues: []
                          };
            // console.log("linkage", linkage, meeting.linkage.meetings[0].id, meeting.linkage.tasks[0].id);
            let statusChanged = (refCopy.status!=meeting.status);
            let prevStatus = refCopy.status;
            let selfLinkData = meeting.status!='CANCEL' ? this.link.getLinkData('meetings', meeting) : {};
            console.log("runninh transaction", eventId, dataToSave, linkage , selfLinkData);
            await this.link.saveDocumentData(this.db.allCollections.meeting, eventId, dataToSave, linkage , selfLinkData, transaction, type);

          }

          // If this is the very first instance of the series of meetings, check for status change and subsequently
          // update the records as required
          if(type=='new'){
            this.kpi.updateKpiDuringCreation('Meeting',meeting.noOfOccurence,sessionInfo)
          } else {
            let statusChanged = (refCopy.status!=meeting.status);
            let prevStatus = refCopy.status;
            if(statusChanged)
              {
                this.kpi.updateKpiDuringUpdate('Meeting',prevStatus,meeting.status,meeting,sessionInfo, (toCascadeChanges ? meeting.noOfOccurence - meeting.eventSequenceId + 1 : 1), widgetData, transaction, null);
              } else {
                // status has not changed so add the new meetings as count increased
                this.kpi.updateKpiDuringCreation('Meeting',meeting.noOfOccurence - refCopy.noOfOccurence,sessionInfo)
              }
          }

          // Complete the last transaction which is to be executed out of while loop
          // if it's a new event or no of events changed we have increase or decrease the usage counts
          // so during cleanup or cancellation it'll decrese the count, and while adding it'll increase the count
          this.aclKpi.updateKpiDuringCreation(
            'create-meeting',
            sessionInfo,
            transaction,
            meeting.status=='CANCEL' ?
              (toCascadeChanges ? -1*(refCopy.noOfOccurence - refEventSequenceId +1) : -1)
              :
              (type=='new' ? meeting.noOfOccurence : meeting.noOfOccurence - refCopy.noOfOccurence)// if there is a new meeting sequences added, it will automatically detect the diff and increase the count
          );

          // Complete the last transaction which is to be executed out of while loop

          if(type=='new'){
            transaction.set(docRef, {totalMeeting: totalSequenceId}, {merge: true});
          }
          console.log("runninh transaction", totalSequenceId);
      }.bind(this));
    }.bind(this)).then(function() {
        if(!silentMode){

          // this.meetingExpand = this.issueExpand = this.riskExpand = this.taskExpand = false;
          // what about seting the values of other fields which are required to be reset post update
          let infodata = (meeting.status == 'CANCEL' ? refCopy : meeting);
          let eventInfo = {
            origin: 'meetings',
            eventType: type=='new' ? 'add' : meeting.status == 'CANCEL' ? 'cancel' : 'update',
            data: {
              id: refCopy.id,
              subscriberId: subscriberId,
              ...infodata
            },
            prevData: refCopy,
          };
          let notifications = this.itemupdate.getNotifications(eventInfo);
          this.notification.createNotifications(notifications);
          if(meeting.status != 'CANCEL'){
            // this.sendMail(meeting.attendeeList,refCopy.id,meeting.meetingStart,meeting.meetingEnd);
          }

          // this.sfp.defaultAlert("Successful","Meeting Data updated successfully.");
          // this.navData.loader = false;
          console.log("runninh transaction", {status: 'success', title: "Successful", body: "Meeting Data updated successfully."});
          return {status: 'success', title: "Success", body: "Meeting " +  (type=='new' ? 'created' : 'updated') + " successfully."};

        }
    }.bind(this)).catch(function(error) {
        console.log("runninh transaction failed",error);
        return {status: 'failed', title: "Error", body: "Meeting " + (type=='new' ? 'creation' : 'updation') + " failed. Please try again."};
        // this.sfp.defaultAlert("Error Update Meeting", "Meeting Data update failed. " + error);
        // this.navData.loader = false;
    }.bind(this));
  }


  // share meeting summary
  async shareMeetingMinutes(meeting, linkages)
  {
    if(meeting.data.status != 'COMPLETED'){
      return {status: "warning", title: "Meeting status Open", body: "Meeting minutes can only be shared for COMPLETED meetings through email. Please mark the meeting COMPLETED and then share meeting minutes."};
    } else {
      let m = meeting.data;
      let id = meeting.id;
      Object.keys(linkages).forEach(async lt=>{
        if(!linkages[lt] || linkages[lt].length==0){
          // linkage data not yet fetched, so fetch it now
          await this.link.getLinkagesOnce(id,'meeting', lt)
                .then(allDocs=>{
                  linkages[lt] = [];
                  allDocs.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        let id = doc.id;
                        let data = doc.data();
                        // console.log(doc.id, " => ", doc.data());
                        linkages[lt].push({id,data});
                    });
                })
        }
      })
      let minutesObj = {
        toEmail:m.attendeeList.map(a=>{return {email: a.email};}),
        meetingStart: moment.utc(m.meetingStart).format('MMM DD, YYYY h:mm a') + " UTC",
        toName: m.ownerId.name,
        meetingTitle:m.meetingTitle,
        agendas:m.agendas,
        notes: m.notes,
        attendeeList: m.attendeeList,
        meetingList: linkages.meetings,
        riskList: linkages.risks,
        issueList:linkages.issues,
        taskList:linkages.tasks,
      }
      console.log("minutesObj email", minutesObj);
      this.sendmail.sendCustomEmail(this.sendmail.shareMeetingMinutesPath,minutesObj)
      .then((sent: any)=>
        {
          this.aclKpi.updateKpiDuringCreation(
            'share-meeting',
            {subscriberId: m.subscriberId} , //sessionInfo,
            null, //batch,
            m.attendeeList.length
          );

        });
      return {status: "success", title: "Meeting Minutes", body: "Meeting minutes shared with attendees through email."};
    }
  }

  // record response from attendees
  recordMeetingResponse(id: any,userProfile : any, response: any)
  {
      // let meeting$ = this.db.afs.collection(this.db._COLL_MEETING).doc(notification.refValues.meetingId);
      let rlDocRef = this.db.afs.firestore.collection(this.db.allCollections.meeting).doc(id);
      let title="";
      let body="";
      return this.db.afs.firestore.runTransaction((transaction)=>{
        // This code may get re-run multiple times if there are conflicts related to rlDocRef.
        return transaction.get(rlDocRef).then((doc)=>{
            if (doc.exists) {
              let meetingData = doc.data();
              let attendeeList=meetingData.attendeeList;
              if(new Date(meetingData.meetingStart.seconds*1000) < new Date() && ["accept","decline"].includes(response))
              {
                  title= "Warning";
                  body = "Please note that this meeting is over. You cannot accept or reject a meeting of the past.";
                  return {status: false, title, body };
              } else {
                // Now check the attendee data and change it to
                let attendeePos = attendeeList.findIndex((u,i)=>u.uid==userProfile.uid);

                if(attendeePos != -1){
                  let attendee = attendeeList[attendeePos];
                  // change the acceptance to true
                  Object.assign(attendee,{accepted: response});
                  // now replace the array element with splice
                  attendeeList.splice(attendeePos,1,attendee);

                  // Now update the document with merge option true as we only intend to update the attendeelist

                  //transaction.update(rlDocRef, {attendeeList: attendeeList});
                  this.db.updateTransactDocument(transaction, rlDocRef, {attendeeList: attendeeList});
                  // So remove the notification
                  title= "Success";
                  body = "Meeting response recorded successfully";
                  return {status: false, title, body };
                }
              }
            } else {
                // doc.data() will be undefined in this case
                title= "Warning";
                body = "Please note that the meeting no longer exists.";
                return {status: false, title, body };
                // this.clearNotification(notification);
            }
        })
    }).catch((error)=>{
      title= "Error";
      body = "Unable to complete the request, please try again.";
      return {status: false, title, body };
    });

  }
}
