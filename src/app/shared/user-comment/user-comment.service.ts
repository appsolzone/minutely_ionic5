import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DatabaseService } from '../database/database.service';
import { SendEmailService } from '../send-email/send-email.service';
import { KpiService } from 'src/app/shared/kpi/kpi.service';

@Injectable({
  providedIn: 'root'
})
export class UserCommentService {



  public newComment = {
    author:'',
    comment:'',
    picUrl:'',
    uid:'',
    date:new Date(),
    totalComments:this.db.frb.firestore.FieldValue.increment(1)
  }
  constructor(
    private db:DatabaseService,
    private senDmail:SendEmailService,
    public aclKpi: KpiService,
  ) { }

    fetchAllComments(collectionName,doc):Observable<any>{
      return this.db.getAllDocumentsSnapshot(`${this.db.allCollections[collectionName]}/${doc}/${this.db.allCollections.comment}`);
    }

    addComment(commentObj,servicedoc, sessionInfo: any=null){
    let docRef = this.db.afs.collection(this.db.allCollections[servicedoc.collectionName]).doc(servicedoc.id).ref;
    let commentRef = this.db.afs.collection(`${this.db.allCollections[servicedoc.collectionName]}/${servicedoc.id}/${this.db.allCollections.comment}`).doc().ref;

    return this.db.afs.firestore.runTransaction(function(transaction) {
      return transaction.get(docRef).then(function(regDoc) {
        this.db.setTransactDocument(transaction,docRef,{latestComment:commentObj},true);

        delete commentObj.totalComment;
        this.db.setTransactDocument(transaction,commentRef,commentObj,true);
        this.aclKpi.updateKpiDuringCreation(
          'comments-log',
          sessionInfo,
          transaction,
          1
        );
      }.bind(this))
    }.bind(this))
    .then(()=>{
      this.sendEmail(servicedoc.members,commentObj,servicedoc)
    })
  }


  sendEmail(members:any[],commentObj,servicedoc)
  {
    console.log("calling sendEmail",members,commentObj,servicedoc);
    for(var i = 0; i < members.length; i ++)
    {
      this.senDmail.sendCustomEmail(this.senDmail.commentMailPath,
        {
          toEmail:members[i].email,
          toName:members[i].name,
          commenterName: commentObj.author,
          commentCat:servicedoc.collectionName,
          title:servicedoc[`${servicedoc.collectionName}Title`],
          comment:commentObj.comment,
          commentedAt:moment.utc().format('MMM DD, YYYY h:mm a') + " UTC"

        }).then((sent: any)=>
        {
          console.log("mail sent response:",sent);
        });
    }
  }
}
