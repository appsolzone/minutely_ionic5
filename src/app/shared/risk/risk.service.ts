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
                        risk.riskOwner.u.name + ' ' + risk.riskOwner.u.email + " " +
                        risk.riskInitiator.u.name + ' ' + risk.riskInitiator.u.email + " " +
                        status+" ";
      searchStrings += moment(new Date(risk.riskInitiationDate)).format("D") + " "+
                        moment(new Date(risk.riskInitiationDate)).format("YYYY") + " "+
                        moment(new Date(risk.riskInitiationDate)).format("MMMM") + " " +
                        moment(new Date(risk.riskInitiationDate)).format("MMM");
    return this.searchMap.createSearchMap(searchStrings);
  }




}
