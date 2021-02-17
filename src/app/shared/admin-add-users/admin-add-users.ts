import { Injectable } from '@angular/core';
import { ComponentsService } from '../components/components.service';
import { DatabaseService } from '../database/database.service';
import { SendEmailService } from '../send-email/send-email.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAddUsersService {
  public newMemberAddRoles:any = ['USER','ADMIN','EXTERNAL'];
  public membersStatus:any = ['All','ACTIVE','REGISTERED','EXTERNAL','SUSPENDED','REJECTED','LEAVER'];
  systemGeneratedPassword:any;
  constructor(
    private db:DatabaseService,
    private componentService:ComponentsService,
    private sendEmailService:SendEmailService
  ) { }

  // new register
  addNewUser(newUserData,orgProfile){
  this.componentService.showLoader();  
  this.systemGeneratedPassword = this.generatePassWord();
  console.log('password',this.systemGeneratedPassword);

  this.db.adminFrb.auth().createUserWithEmailAndPassword(newUserData.email, this.systemGeneratedPassword).then(res =>{
          this.db.SendAdminAuthVerificationMail();
          this.sendEmailService.sendCustomEmail(this.sendEmailService.emailActionPath,{
            toEmail:newUserData.email,
            toName: newUserData.name,
            orgName:orgProfile.companyName,
            sId:orgProfile.subscriberId,
            uName:newUserData.email,
            pwd: this.systemGeneratedPassword
          }).then((sent: any)=>{ 
            // Nothing to do here
          });
          this.componentService.hideLoader();
          // data collect and insert
          this.batchCondition(res,newUserData,orgProfile,"two");
        }).catch(err =>{
          // user create failed
          if(err.code == "auth/email-already-in-use"){ // email already exists
            this.checkIfUserExitsInThisOrg(newUserData,orgProfile).then(res =>{
              if(res.length == 1){
                this.componentService.hideLoader();
                this.componentService.presentAlert("Error","The user exists for the organisation. Please check member list to take necessary action");
              }else{
               let queryObj = [{
                  field:'email',
                  operator:'==',
                  value:newUserData.email
                }]
                this.db.
                getAllDocumentsByQuery(this.db.allCollections.useruids,queryObj)
                  .then(function(querySnapshot){
                    let userDetails= {user: { uid: null }};
                    querySnapshot.forEach(function(doc){
                      Object.assign(userDetails,{'id': doc.id, 'data': doc.data(), 'user': doc.data()})
                    })

                    console.log("user details we get",userDetails);

                    if(userDetails.user.uid){
                      this.systemGeneratedPassword = 'Please use your current password for the email mentioned above';
                      this.batchCondition(userDetails,newUserData,orgProfile,"two");
                    } else {
                      this.componentService.presentAlert("Error","The user can not be added. Please try again. If the problem persists please request the user to Sign up using his/her credentials.");
                      this.componentService.hideLoader();
                    }
                  }.bind(this)).catch(function(err){
                    console.log(err);
                    this.componentService.presentAlert("Error","The user can not be added. Please try again. If the problem persists please request the user to Sign up using his/her credentials.");
                    this.componentService.hideLoader();
                    // reject(err);
                  }.bind(this));
              }
            }).catch(err =>{
              this.componentService.hideLoader();
              this.componentService.presentAlert("Error",err);
            })
          }else{ // if email not exits
            this.componentService.hideLoader();
            this.componentService.presentAlert("Error",err);
          }
        })
  }
  generatePassWord(){
    let password = "";
    const possibleCaps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const possibleLowers = "abcdefghijklmnopqrstuvwxyz";
    const possibleNumbers = "0123456789";
    const possibleSpecial = "@#$%^&!";
    const possible = possibleCaps + possibleLowers + possibleNumbers + possibleSpecial;

    for (let i = 0; i < 10; i++)
    password += possible.charAt(Math.floor(Math.random() * possible.length));
    password += password.match(/[A-Z]/g)==null ? possibleCaps.charAt(Math.floor(Math.random() * possibleCaps.length)) : '';
    password += password.match(/[a-z]/g)==null ? possibleLowers.charAt(Math.floor(Math.random() * possibleLowers.length)) : '';
    password += password.match(/[0-9]/g)==null ? possibleNumbers.charAt(Math.floor(Math.random() * possibleNumbers.length)) : '';
    password += password.match(/(@|#|\$|%|\^|&|!)/g)==null ? possibleSpecial.charAt(Math.floor(Math.random() * possibleSpecial.length)) : '';
    return password;
  }

  checkIfUserExitsInThisOrg(newUserData,orgProfile): Promise<any>{
     let queryObj = [{
      field:'subscriberId',
      operator:'==',
      value:orgProfile.subscriberId   
     },
      {
        field:'email',
        operator:'==',
        value:newUserData.email
      }]
    let arr =[];
    return new Promise((resolve: any, reject: any)=>{
      this.db.getAllDocumentsByQuery(this.db.allCollections.users,queryObj).then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          arr.push({'id': doc.id, 'data': doc.data()})
        })
        resolve(arr);
      }).catch(err =>{
        reject(err);
      })
    })
  }
 async batchCondition(userDetails,newUserData,orgProfile,type){
    console.log('user data',newUserData);
    console.log('org Data',orgProfile);
    if(newUserData.role == "ADMIN"){
      this.componentService.hideLoader();
      await this.componentService.presentAlertConfirm("Warning","Are you sure you want to create another admin user. or select user").then(res =>{
        console.log("alert response",res);
        if(res){this.batchPerform(userDetails,newUserData,orgProfile,type);} 
        else{ this.componentService.hideLoader();}
      }).catch(err=>{
        this.componentService.hideLoader();
      })
    }else{
      this.componentService.hideLoader();
      this.batchPerform(userDetails,newUserData,orgProfile,type);
    }
  }
  batchPerform(userDetails,newUserData,orgProfile,type){
    this.componentService.showLoader();  
    console.log('user data',newUserData);
    console.log('org Data',orgProfile);
    let userId = '';
    if(type == "one"){
      userId = userDetails.data.uid;
    }else if(type == "two"){
      userId = userDetails.user.uid;

    }
    let batch = this.db.afs.firestore.batch();
    const userAdd = this.db.afs.collection(this.db.allCollections.users).doc().ref;
    batch.set(userAdd,{
      'email': newUserData.email,
      'isExternal': newUserData.role=="EXTERNAL" ? true : false,
      'jobTitle': newUserData.jobTitle,
      'name': newUserData.name,
      'phoneNumber': newUserData.phone,
      'picUrl': "",
      'role': newUserData.role,
      'status':'ACTIVE',
      'subscriberId': orgProfile.subscriberId,
      'uid': userId,
      'userCreationTimeStamp': this.db.frb.firestore.FieldValue.serverTimestamp(),
      'address':'',
      'fcm':'',
      'lastUpdateTimeStamp':this.db.frb.firestore.FieldValue.serverTimestamp(),

    })

    // add to userids collection for lookup
    const useruids = this.db.afs.collection(this.db.allCollections.useruids).doc(userId).ref;
    batch.set(useruids,{ uid: userId, email:newUserData.email });

    // add to users notification
    const userNotification = this.db.afs.collection(this.db.allCollections.notifications).doc(userId).ref;
    batch.set(userNotification,{
      uid: userId,
      name:newUserData.name,
      totalAlerts: 0,
      totalAlertsUnread: 0
    });

    // update of organization licenses
      let subRef = this.db.afs.collection(this.db.allCollections.subscribers).doc(orgProfile.subscriberId).ref;
      batch.update(subRef,{
        'noOfFreeLicense': this.db.frb.firestore.FieldValue.increment(-1), //this.subscriberData.noOfFreeLicense - 1,
      })
   

    batch.commit().then(res =>
      {
        this.componentService.hideLoader();
        this.componentService.presentToaster('New User added successfully');
         // send email to the user
         this.sendEmailService.sendCustomEmail(this.sendEmailService.emailActionPath,{
          toEmail: newUserData.email,
          toName: newUserData.name,
          orgName: orgProfile.subscriberId,
          sId: orgProfile.subscriberId,
          uName: newUserData.name,
          pwd: this.systemGeneratedPassword
        }).then(()=>
        {
          // Nothing to do here
        })
      }).catch(err =>{
      this.componentService.hideLoader();
      this.componentService.presentAlert("Error",err);
    })
  }
}
