import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-comments',
  templateUrl: './task-comments.component.html',
  styleUrls: ['./task-comments.component.scss'],
})
export class TaskCommentsComponent implements OnInit {
 @Input() sessionInfo: any;
  @Input() task: any;

  // form data
  public taskDetails: any;

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
   this.taskDetails = this.task?.data;
    console.log("taskdetails", this.taskDetails);
    // if(this.taskDetails){
    //   //this.checkAcceptence();
    // }
  }

  ngOnChanges() {
    this.taskDetails = this.task?.data;
    if(this.taskDetails){
      // TBA
    }
  }

  goToCommentPage(task){
    this.router.navigate(['task/comments'],{state: {data:{task: task}}});
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '../../../../assets/shapes.svg';
  }
}
