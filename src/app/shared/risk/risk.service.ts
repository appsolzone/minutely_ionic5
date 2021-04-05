import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DatabaseService } from '../database/database.service';
import { KpiService } from '../kpi/kpi.service';
import { LinkageService } from '../linkage/linkage.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SendEmailService } from '../send-email/send-email.service';
import { TextsearchService } from '../textsearch/textsearch.service';

@Injectable({
  providedIn: 'root'
})
export class RiskService {
  newRisk = {
      riskTitle :'',
      riskOwner :{
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      riskInitiationDate :null,
      riskEntryDate : null,
      targetCompletionDate :null,
      actualCompletionDate: null,
      riskStatus: 'OPEN',
      lastUpdateDate:null,
      subscriberId: null,
      latestComment:{
        author:'',
        comment:'',
        date:null,
        picUrl:'',
        totalComment:0
      },
      riskInitiator :{
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      tags:[],
      riskProbability :'',
      riskImpact:'',
      riskMitigation:'',
      riskContingency:'',
      searchMap:{},
      ownerInitiatorUidList:[],
  }

constructor(
    public db: DatabaseService,
    public searchMap: TextsearchService,
    public link: LinkageService,
    public kpi: KpiService,
    public notification: NotificationsService,
    public sendmail: SendEmailService,
  ){
     // TBA
  }

  // Read
  getRisksOnce(queryObj:any[], textSearchObj: any = null, limit: number=null){
    return this.db.getAllDocumentsByQuery(this.db.allCollections.risk, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getRisks(queryObj:any[], textSearchObj: any = null, limit: any=null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.risk, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getRiskById(id: string){
    return this.db.getDocumentSnapshotById(this.db.allCollections.risk, id);
  }

  // validate basic info functions
  validTitle(m){
    let risk = m.data;
    let status = true;
    let title = "Risk title";
    let body = "";
    if(risk.riskTitle && risk.riskTitle.trim()){
      status = true;
    } else {
      body = "Please enter a valid risk title and try again.";
      status=false;
    }
    return {status, title, body};
  }

    dateChange(m, refInformation){
    let risk = m.data;
    let title='Risk Date';
    let body='';
    let status = true;
    let startDateTime = risk.riskInitiationDate ? new Date(risk.riskInitiationDate) : null;
    let endDateTime = risk.targetCompletionDate ? new Date(risk.targetCompletionDate) : null;


    if(!startDateTime) {
      status = false;
      title = "Invalid risk Start Date";
      body = "Risk start date cannot be empty. The risk start time should be future time.";
    } else if(!endDateTime) {
      status = false;
      title = "Invalid risk End Date";
      body = "Risk end date cannot be empty. The risk end time should be future time.";
    } else if((refInformation.riskInitiationDate == risk.riskInitiationDate && refInformation.riskEnd == risk.targetCompletionDate ) ||
              (new Date() <= startDateTime && new Date() <= endDateTime)
            ) {
      status = true;
    } else {
          title = "Invalid risk Dates";
          body = "risk cannot be set in past. The risk start and end time should be future time.";
          status= false;
    }
    return {status, title, body};
  }

    validateBasicInfo(risk, refInformation){

    let check = this.dateChange(risk,refInformation);

    if(!check.status){
      return check;
    }

    check = this.validTitle(risk);

    if(!check.status){
      return check;
    }

    return {status: true, title: 'Valid Basic Info', body: 'Valid Basic Info'};

  }


   processRisk(risk, refInformation, editedlinkages, sessionInfo){
    // if risk is cancelled, just change the status to cancel

    // if changes are confined only to this instance, not be propagated, copy referenceInfomation for recurrence, if any

    // else changes to be propagated
    let riskData = risk.data;
    let type = risk.id ? 'update' : 'new';
    //return this.transaction(riskData, refInformation, editedlinkages, sessionInfo, type, false);
  }

    searchTextImplementation(risk){
    let status = risk.riskStatus;

    let searchStrings = risk.riskTitle +" "+
                        risk.tags.join(' ') +' ' +
                        risk.riskOwner.u.name + ' ' + risk.riskOwner.u.email + " " +
                        risk.riskInitiator.u.name + ' ' + risk.riskInitiator.u.email + " " +
                        status+" ";
      searchStrings += moment(new Date(risk.riskInitiationDate)).format("D") + " "+
                        moment(new Date(risk.riskInitiationDate)).format("YYYY") + " "+
                        moment(new Date(risk.riskInitiationDate)).format("MMMM") + " " +
                        moment(new Date(risk.riskInitiationDate)).format("MMM");
    return this.searchMap.createSearchMap(searchStrings);
  }



  //  transaction(risk, refCopy, editedlinkages, sessionInfo, type, silentMode: boolean = false){
  //   const {subscriberId, uid}= sessionInfo;
  //   // we are handling type = 'update' && 'new' only
  //   let refEventSequenceId = risk.eventSequenceId;
  //   // No of occurences is more than one if we have cascade flag true
  //   //let noOfOccurence = risk.noOfOccurence;
  //   let toCascadeChanges = refCopy.toCascadeChanges;
  //   // let's lock the document we would like to create readlock
  //   let docId = subscriberId;
  //   let docRef = this.db.afs.collection(this.db.allCollections.subscribers).doc(docId).ref;
  //   let eventId = null;
  //   let eventRef = null;
  //   // transaction provide here
  //   return this.db.afs.firestore.runTransaction(function(transaction) {
  //     // get the read consistency lock on the subscriber doc
  //     return transaction.get(docRef).then(async function(regDoc) {
  //         let subscriber = regDoc.data();
  //         let totalSequenceId = type=='new' ?
  //                               (subscriber.totalRisk ? (subscriber.totalRisk + 1) : 1)
  //                               :
  //                               risk.eventId;
  //         // initialise the summary view object
  //         let event = {...risk};
  //         // Note that we should start at the current event seq id to cascade the events
  //         // for(let i=refEventSequenceId; i<=(toCascadeChanges ? noOfOccurence : refEventSequenceId); i++){
  //           console.log("runninh transaction");
  //           //let eventDates = this.getEventStartAndEndDate((i-refEventSequenceId+1), risk.isOccurence,this.status=='CANCEL' ? refCopy : risk,type);

  //           eventId = subscriberId + "_"+ (totalSequenceId);
  //           eventRef = this.db.afs.collection(this.db.allCollections.risk).doc(eventId).ref;
  //           if(type=='new' && !refCopy.id){
  //             refCopy.id = eventId;
  //           }
  //           console.log("runninh transaction", eventId);
  //           let dataToSave = risk.riskStatus!='CANCEL' ?
  //                           {...event, 
  //                             // ...eventDates, 
  //                             // eventSequenceId: i, 
  //                              eventId: totalSequenceId,
  //                             // date: moment(eventDates.startDateTime).format('YYYY-MM-DD'),
  //                             searchMap: this.searchTextImplementation({
  //                               ...event, 
  //                               //...eventDates,
  //                                eventSequenceId: i, 
  //                                eventId: totalSequenceId,
  //                               }),
  //                             // status: type,
  //                             updatedAt: new Date(),
  //                           }
  //                           :
  //                           {status: risk.status, //...eventDates, eventSequenceId: i, eventId: totalSequenceId,
  //                                    // date: moment(eventDates.startDateTime).format('YYYY-MM-DD'),
  //                                    searchMap: this.searchTextImplementation({...refCopy, status: risk.riskStatus}),
  //                                    // status: type,
  //                                    updatedAt: new Date(),
  //                                  };
  //           // Propagate linkage only if linkage propagation is true along with other propagation options
  //           let linkage = risk.riskStatus!='RESOLVED' && ((!toCascadeChanges && i==refEventSequenceId) || (toCascadeChanges)) ? // && this.toCascadeChanges && this.toCascadeLinakges)) ?
  //                           {
  //                             risks:editedlinkages.risks ? editedlinkages.risks : [],
  //                             meetings: editedlinkages.meetings ? editedlinkages.meetings : [],
  //                             tasks: editedlinkages.tasks ? editedlinkages.tasks : [],
  //                             issues: editedlinkages.issues ? editedlinkages.issues : []
  //                           }
  //                         :
  //                         {
  //                           risks:[],
  //                           meetings: [],
  //                           tasks: [],
  //                           issues: []
  //                         };
  //           // console.log("linkage", linkage, risk.linkage.risks[0].id, risk.linkage.tasks[0].id);
  //           let statusChanged = (refCopy.riskStatus!=risk.riskStatus);
  //           let prevStatus = refCopy.riskStatus;
  //           let selfLinkData = risk.riskStatus!='CANCEL' ? this.link.getLinkData('risks', risk) : {};
  //           console.log("runninh transaction", eventId, dataToSave, linkage , selfLinkData);
  //           await this.link.saveDocumentData(this.db.allCollections.risk, eventId, dataToSave, linkage , selfLinkData, transaction, type);

  //        // }

  //         // If this is the very first instance of the series of risks, check for status change and subsequently
  //         // update the records as required
  //         if(type=='new'){
  //           this.kpi.updateKpiDuringCreation('risk',risk.noOfOccurence,sessionInfo)
  //         } else {
  //           let statusChanged = (refCopy.status!=risk.status);
  //           let prevStatus = refCopy.status;
  //           if(statusChanged)
  //             {
  //               this.kpi.updateKpiDuringUpdate('risk',prevStatus,risk.status,risk,sessionInfo, (toCascadeChanges ? risk.noOfOccurence - risk.eventSequenceId + 1 : 1));
  //             }
  //         }

  //         // Complete the last transaction which is to be executed out of while loop

  //         if(type=='new'){
  //           transaction.set(docRef, {totalrisk: totalSequenceId}, {merge: true});
  //         }
  //         console.log("runninh transaction", totalSequenceId);
  //     }.bind(this));
  //   }.bind(this)).then(function() {
  //       if(!silentMode){

  //         // this.riskExpand = this.issueExpand = this.riskExpand = this.taskExpand = false;
  //         // what about seting the values of other fields which are required to be reset post update
  //         let infodata = (risk.status == 'CANCEL' ? risk : refCopy);
  //         let eventInfo = {
  //           origin: 'risks',
  //           eventType: risk.status == 'CANCEL' ? 'cancel' : 'update',
  //           data: {
  //             id: refCopy.id,
  //             subscriberId: subscriberId,
  //             ...infodata
  //           },
  //           prevData: refCopy,
  //         };
  //         this.notification.createNotifications(eventInfo);
  //         if(risk.status != 'CANCEL'){
  //           // this.sendMail(risk.attendeeList,refCopy.id,risk.riskStart,risk.riskEnd);
  //         }

  //         // this.sfp.defaultAlert("Successful","risk Data updated successfully.");
  //         // this.navData.loader = false;
  //         console.log("runninh transaction", {status: 'success', title: "Successful", body: "risk Data updated successfully."});
  //         return {status: 'success', title: "Success", body: "risk " +  (type=='new' ? 'created' : 'updated') + " successfully."};

  //       }
  //   }.bind(this)).catch(function(error) {
  //       console.log("runninh transaction failed",error);
  //       return {status: 'failed', title: "Error", body: "risk " + (type=='new' ? 'creation' : 'updation') + " failed. Please try again."};
  //       // this.sfp.defaultAlert("Error Update risk", "risk Data update failed. " + error);
  //       // this.navData.loader = false;
  //   }.bind(this));
  // }

}
