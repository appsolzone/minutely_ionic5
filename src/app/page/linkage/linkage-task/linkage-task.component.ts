import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-linkage-task',
  templateUrl: './linkage-task.component.html',
  styleUrls: ['./linkage-task.component.scss'],
})
export class LinkageTaskComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() tasks: any[];
  public linkedTasks: any[];

  constructor(
    private router:Router,
  ) { }

  ngOnInit() {
    if(this.tasks){
      this.getlinkedTasks();
    }
  }

  ngOnDestroy(){}

  ngOnChanges() {
    if(this.tasks){
      this.getlinkedTasks();
    }
  }

  getlinkedTasks(){
    let newTasks = this.tasks.map(t=>{
      const data = t.data;
      const id = t.id;
      const taskInitiationDate = new Date(data.taskInitiationDate?.seconds*1000);
      const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
      // return {id, data: { ...data, startTime, endTime }};
      return {id, data: {...data, taskInitiationDate, targetCompletionDate }};
    });
    this.linkedTasks =[];
    this.linkedTasks = newTasks.sort((a:any,b:any)=>a.data.taskInitiationDate-b.data.taskInitiationDate);
  }

  openTaskDetails(task){
    this.router.navigate(['task/task-details-linkage/'+task.id],{state: {data:{task: task}}});
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

}
