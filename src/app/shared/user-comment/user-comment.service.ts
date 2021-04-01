import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DatabaseService } from '../database/database.service';
import { SendEmailService } from '../send-email/send-email.service';

@Injectable({
  providedIn: 'root'
})
export class UserCommentService {

  constructor(
    private _db:DatabaseService,
    private _senDmail:SendEmailService,
  ) { }

    fetchAllComments(collectionName,doc):Observable<any>{
      return this._db.getAllDocumentsSnapshot(`${this._db.allCollections[collectionName]}/${doc}/${this._db.allCollections.comment}`);
    }

    addComment(commentObj,servicedoc){
    let docRef = this._db.afs.collection(this._db.allCollections[servicedoc.parentModule]).doc(servicedoc.id).ref;
    let commentRef = this._db.afs.collection(`${this._db.allCollections[servicedoc.parentModule]}/${servicedoc.id}/${this._db.allCollections.comment}`).doc().ref;

    return this._db.afs.firestore.runTransaction(function(transaction) {
      return transaction.get(docRef).then(function(regDoc) {
        this._db.setTransactDocument(transaction,docRef,{latestComment:commentObj},true);
        
        delete commentObj.totalComment;
        this._db.setTransactDocument(transaction,commentRef,commentObj,true);
      }.bind(this))
    }.bind(this))
  }


  sendEmail(members:any[],commentObj,servicedoc)
  {
    for(var i = 0; i < members.length; i ++)
    {
      this._senDmail.sendCustomEmail(this._senDmail.commentMailPath,
        {
          toEmail:members[i].email,
          toName:members[i].name,
          commenterName: commentObj.author,
          commentCat:servicedoc.parentModule,
          title:servicedoc[`${servicedoc.parentModule}Title`],
          comment:commentObj.comment,
          commentedAt:moment.utc().format('MMM DD, YYYY h:mm a') + " UTC"

        }).then((sent: any)=>
        {

        });
    }
  }
}
