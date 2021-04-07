import { Injectable } from '@angular/core';
import { ComponentsService } from '../components/components.service';
import { DatabaseService } from '../database/database.service';
import { ManageuserService } from '../manageuser/manageuser.service';
import { RegistrationService } from '../registration/registration.service';
import { SendEmailService } from '../send-email/send-email.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAddUsersService {
  public newMemberAddRoles:any = ['USER','ADMIN'];
  systemGeneratedPassword:any;
  userDataForm:any;
  constructor(
    private db:DatabaseService,
    private componentService:ComponentsService,
    private sendEmailService:SendEmailService,
    private registerationService:RegistrationService,
    private manageUserService:ManageuserService
  ) {this.userDataForm = this.manageUserService.newUser}

  // new register
  addNewUser(newUserData,orgProfile){
  this.componentService.showLoader();
  this.systemGeneratedPassword = this.generatePassWord();

  return this.db.adminFrb.auth().createUserWithEmailAndPassword(newUserData.email, this.systemGeneratedPassword).then(res =>{
          console.log("======= first one ========");
          if(res.user.uid){
          this.db.SendAdminAuthVerificationMail();
          this.sendNewUserEmail(newUserData,orgProfile);
          // data collect and insert
          return this.transitionCondition(res,newUserData,orgProfile,"two");
          }
        }).catch(err =>{
          // user create failed
          if(err.code == "auth/email-already-in-use"){ // email already exists
            this.checkIfUserExitsInThisOrg(newUserData,orgProfile)
            .then(function(res){
              if(res.length == 1){
                return this.errorAlert('already-exist-user');
              }else{
                return this.checkInUseruidsColl(newUserData,orgProfile);
              }
            }.bind(this))
            .catch(err =>{
             return this.errorAlert(err);
            })
            }else{ // if email not exits
              return this.errorAlert(err);
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
    console.log("======= checkIfUserExitsInThisOrg ========");
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


 async transitionCondition(userDetails,newUserData,orgProfile,type){
  console.log("======= transitionCondition ========");
  this.componentService.hideLoader();
   let userId = '';
    if(type == "one"){
      userId = userDetails.data.uid;
    }else if(type == "two"){
      userId = userDetails.user.uid;
    }
    return await this.componentService.presentAlertConfirm(
      "Warning",`Are you sure you want to register ${newUserData.name} in ${orgProfile.companyName} as ${newUserData.role}`
      )
     .then(async function(res:any){
      console.log("======= presentAlertConfirm ========");
      if(res){
        this.componentService.showLoader();
        await this.registerationService.joinSubscriber(userId,orgProfile.subscriberId, newUserData.name,newUserData.email,newUserData);
        return true;
        }
     }.bind(this))
     .then(function(res)
      {
        console.log("======= presentAlertConfirm ========");
        if(res){
        let dataObj= {newUserData:{...newUserData},orgProfile:{...orgProfile}};
        return this.successAlert('New User added successfully',true,dataObj);
        }
      }.bind(this))
      .catch(err=>{
        return this.errorAlert(err);
    })

  }

  checkInUseruidsColl(newUserData,orgProfile){
   console.log("======= checkInUseruidsColl ========");
   let queryObj = [{
      field:'email',
      operator:'==',
      value:newUserData.email
    }]
    return this.db.
    getAllDocumentsByQuery(this.db.allCollections.useruids,queryObj)
      .then(function(querySnapshot){
        let userDetails= {user: { uid: null }};
        querySnapshot.forEach(function(doc){
          console.log("user uid data",doc.data());
          Object.assign(userDetails,{'id': doc.id, 'data': doc.data(), 'user': doc.data()})
        })

        console.log("user details we get",userDetails);

        if(userDetails.user.uid){
          this.systemGeneratedPassword = 'Please use your current password for the email mentioned above';
          return this.transitionCondition(userDetails,newUserData,orgProfile,"two");
        } else {
        return this.errorAlert('auth-table-error');
        }
      }.bind(this))
      .catch(function(err){
        console.log(err);
        return this.errorAlert('auth-table-error');
      }.bind(this));
  }


  //error alert
  errorAlert(err){
  let errorMsg = ''
  if(err == 'auth-table-error'){
    errorMsg = "The user can not be added. Please try again. If the problem persists please request the user to Sign up using his/her credentials.";
  }else if(err == 'already-exist-user'){
    errorMsg = "The user exists for the organisation. Please check member list to take necessary action";
  }else{
    errorMsg = err;
  }

  this.componentService.hideLoader();
  this.componentService.presentAlert('Error',errorMsg);
  return false;
  }

  //success alert
  successAlert(msg,sendMail:boolean=false,dataObj?:any){
    this.componentService.hideLoader();
    this.componentService.presentToaster(msg);
    if(sendMail)this.sendNewUserEmail(dataObj.newUserData,dataObj.orgProfile);
    return true;
  }

  sendNewUserEmail(newUserData,orgProfile){
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
  }
}
