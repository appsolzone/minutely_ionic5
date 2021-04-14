import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DatabaseService } from '../database/database.service';
import { SendEmailService } from '../send-email/send-email.service';

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
  ) { }

    fetchAllComments(collectionName,doc):Observable<any>{
      return this.db.getAllDocumentsSnapshot(`${this.db.allCollections[collectionName]}/${doc}/${this.db.allCollections.comment}`);
    }

    addComment(commentObj,servicedoc){
    let docRef = this.db.afs.collection(this.db.allCollections[servicedoc.collectionName]).doc(servicedoc.id).ref;
    let commentRef = this.db.afs.collection(`${this.db.allCollections[servicedoc.collectionName]}/${servicedoc.id}/${this.db.allCollections.comment}`).doc().ref;

    return this.db.afs.firestore.runTransaction(function(transaction) {
      return transaction.get(docRef).then(function(regDoc) {
        this.db.setTransactDocument(transaction,docRef,{latestComment:commentObj},true);
        
        delete commentObj.totalComment;
        this.db.setTransactDocument(transaction,commentRef,commentObj,true);
      }.bind(this))
    }.bind(this))
  }


  sendEmail(members:any[],commentObj,servicedoc)
  {
    for(var i = 0; i < members.length; i ++)
    {
      this.senDmail.sendCustomEmail(this.senDmail.commentMailPath,
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
