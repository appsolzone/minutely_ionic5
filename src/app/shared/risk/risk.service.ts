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
      riskInitiationDate :new Date(),
      riskEntryDate : new Date(),
      targetCompletionDate :new Date(),
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
                        risk.riskOwner.name + ' ' + risk.riskOwner.email + " " +
                        risk.riskInitiator.name + ' ' + risk.riskInitiator.email + " " +
                        status+" ";
      searchStrings += moment(new Date(risk.riskInitiationDate)).format("D") + " "+
                        moment(new Date(risk.riskInitiationDate)).format("YYYY") + " "+
                        moment(new Date(risk.riskInitiationDate)).format("MMMM") + " " +
                        moment(new Date(risk.riskInitiationDate)).format("MMM");
    return this.searchMap.createSearchMap(searchStrings);
  }
transaction(riskData, refCopy, editedlinkages, sessionInfo, type, silentMode: boolean = false){

    console.log("getting data     :",riskData);
    console.log("getting ref info :",refCopy);
    console.log("getting linkage  :",editedlinkages);

    const {subscriberId, uid}= sessionInfo;

    let docId = subscriberId;
    let docRef = this.db.afs.collection(this.db.allCollections.kpi).doc(docId).ref;
    let riskId = '';
    return this.db.afs.firestore.runTransaction(function(transaction) {
      return transaction.get(docRef).then(async function(regDoc) {
      
      let subscriber = regDoc.data();
      let totalRisk = type=='new' ?
                              (subscriber.totalRisk ? (subscriber.totalRisk + 1) : 1)
                              : subscriber.totalRisk;

      riskId = (type=='new' && !refCopy.id) ? this.db.afs.createId():refCopy.id; 
      let riskRef = this.db.afs.collection(this.db.allCollections.risk).doc(riskId).ref;
     
      let dataToSave = {...riskData,
                      searchMap: this.searchTextImplementation({...riskData}),
                      updatedAt: new Date(),
                    }
       // If this is the very first instance of the series of risks, check for status change and subsequently
       // update the records as required
      if(type=='new'){
        this.kpi.updateKpiDuringCreation('risk',1,sessionInfo)
      } else {
        let statusChanged = (refCopy.status!=riskData.status);
        let prevStatus = refCopy.status;
        if(statusChanged)
          {
            this.kpi.updateKpiDuringUpdate('risk',prevStatus,riskData.status,riskData,sessionInfo,1);
          }
      }
      // Propagate linkage only if linkage propagation is true along with other propagation options
      let linkage ={ meetings:editedlinkages.meetings ? editedlinkages.meetings : [],
                        risks: editedlinkages.risks ? editedlinkages.risks : [],
                        tasks: editedlinkages.risks ? editedlinkages.risks : [],
                        issues: editedlinkages.issues ? editedlinkages.issues : []
                      }
      let statusChanged = (refCopy.status!=riskData.status);
      let prevStatus = refCopy.status;
      let selfLinkData = this.link.getLinkData('meetings', riskData);
      console.log("runninh transaction", dataToSave, linkage , selfLinkData);
      await this.link.saveDocumentData(this.db.allCollections.meeting, riskId, dataToSave, linkage , selfLinkData, transaction, type);
      
      
      return true;

      }.bind(this))
    }.bind(this))
    .then(function() {
        if(!silentMode){
          let infodata = riskData;
          let eventInfo = {
            origin: 'risks',
            eventType: type=='new' ? 'add' : 'update',
            data: {
              id: riskId,
              subscriberId: subscriberId,
              ...infodata
            },
            prevData: refCopy,
          };
          let notifications = this.itemupdate.getNotifications(eventInfo);
          this.notification.createNotifications(notifications);

          // this.sendMail(meeting.attendeeList,refCopy.id,meeting.meetingStart,meeting.meetingEnd);


          this.sfp.defaultAlert("Successful","risk Data updated successfully.");
          console.log("runninh transaction", {status: 'success', title: "Successful", body: "Risk Data updated successfully."});
          return {status: 'success', title: "Success", body: "risk " +  (type=='new' ? 'created' : 'updated') + " successfully."};

        }
    }.bind(this)).catch(function(error) {
        console.log("running transaction failed",error);
        return {status: 'failed', title: "Error", body: "Risk " + (type=='new' ? 'creation' : 'updation') + " failed. Please try again."};
    }.bind(this));
  }



}
