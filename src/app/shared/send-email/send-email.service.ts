import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {
  EMAIL_BASE_URL: string = 'https://appsolzone.com/mail/';
  //'https://appsolzone.nonworking.com/mail/';

  // custom email configuration paths
  public testingPath = this.EMAIL_BASE_URL + 'index.php';

  public emailActionPath = this.EMAIL_BASE_URL + 'addUser.php';
  public newMeetingInviteMailPath=this.EMAIL_BASE_URL + "meetingInvite.php";
  public updateMeetingMailPath=this.EMAIL_BASE_URL + "updateMeeting.php"

  public newTaskMailPath=this.EMAIL_BASE_URL + "task.php";
  public updateTaskMailPath=this.EMAIL_BASE_URL + "updateTask.php";

  public newRiskMailPath=this.EMAIL_BASE_URL + "risk.php";
  public updateRiskMailPath=this.EMAIL_BASE_URL + "updateRisk.php";

  public newIssueMailPath=this.EMAIL_BASE_URL + "issue.php";
  public updateIssueMailPath=this.EMAIL_BASE_URL + "updateIssue.php";

  public commentMailPath=this.EMAIL_BASE_URL + "comment.php";

  public shareMeetingMinutesPath=this.EMAIL_BASE_URL + "minutes.php";
  public shareIssuePath=this.EMAIL_BASE_URL + "issueShare.php";
  public shareTaskPath=this.EMAIL_BASE_URL + "taskShare.php";
  public shareRiskPath=this.EMAIL_BASE_URL + "riskShare.php";
  constructor(
    private httpClient: HttpClient,
  ) { }

    // custom email send to the user
  sendCustomEmail(path, data)
  {
    return new Promise((resolve: any, reject: any)=>{
      this.httpClient.post(path, data, { responseType: 'text' as 'json'}).subscribe(res=>{
        console.log(res);
        resolve(res);
      },(err)=>console.log("mail send error: ",err));
    })
  }
}
