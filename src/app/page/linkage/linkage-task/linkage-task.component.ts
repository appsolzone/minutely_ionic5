import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { LinkageService } from 'src/app/shared/linkage/linkage.service';

@Component({
  selector: 'app-linkage-task',
  templateUrl: './linkage-task.component.html',
  styleUrls: ['./linkage-task.component.scss'],
})
export class LinkageTaskComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() tasks: any[];
  // @Input() editedlinkedTasks: any[];
  @Input() viewMode = '';
  // @Input() alllinkedTasks: any[];
  @Output() onEditLinkage = new EventEmitter<any>();
  public showSearchList: boolean = false;
  public linkedTasks: any[] =[];
  public editedlinkedTasks: any[] = [];

  constructor(
    private router:Router,
    private common: ComponentsService,
    private linkage: LinkageService
  ) { }

  ngOnInit() {
    if(this.tasks){
      this.getLinkedTasks();
    }
  }

  ngOnDestroy(){}

  ngOnChanges() {
    if(this.tasks){
      console.log("getLinkedTasks....onngChange", this.tasks)
      this.getLinkedTasks();
    }
  }

  getLinkedTasks(){
    let newTasks = this.tasks.map(m=>{
      const data = m.data;
      const id = m.id;
      const state = m.state;
      const taskInitiationDate = data.taskInitiationDate?.seconds ? new Date(data.taskInitiationDate?.seconds*1000) : data.taskInitiationDate;
      const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : data.targetCompletionDate ? data.targetCompletionDate : null;
      // return {id, data: { ...data, startTime, endTime }};
      if(state){
        return {id, data: {...data, taskInitiationDate, targetCompletionDate }, state};
      } else {
        return {id, data: {...data, taskInitiationDate, targetCompletionDate }};
      }

    });
    // this.linkedTasks =[];
    this.linkedTasks = newTasks.sort((a:any,b:any)=>a.data.taskInitiationDate-b.data.taskInitiationDate);
    this.editedlinkedTasks = this.linkedTasks.filter(m=>['pending','delete'].includes(m.state));
    console.log("getLinkedTasks....", this.linkedTasks, this.editedlinkedTasks)
  }

  openTaskDetails(task){
    this.router.navigate(['task/task-details-linkage/'+task.id],{state: {data:{task: task}}});
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

  linkSelectedTask(m){
    console.log("linkSelectedTask", m)
    const data = m.data;
    const id = m.id;
    let idx = this.linkedTasks.findIndex(lm=>lm.id==id);
    if(idx!=-1){
      this.linkedTasks.splice(idx,1);
      this.tasks.splice(idx,1);
    }
    // const taskInitiationDate = new Date(data.taskInitiationDate?.seconds*1000);
    // const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
    // return {id, data: { ...data, startTime, endTime }};
    this.editedlinkedTasks.push({...m,state: 'pending'});
    this.linkedTasks.push({...m,state: 'pending'});
    this.onEditLinkage.emit({editedlinkages: this.editedlinkedTasks});
    this.common.presentToaster("'"+m.data.taskTitle+"' has been added to the list of linked task. It'll be saved when the changes are saved.")
    console.log("linkSelectedTask", this.linkedTasks, this.editedlinkedTasks)
  }

  undoDelinkTask(m,i){
    // now check if the state is to be deleted 'delete'
    // then restore the linkage back
    const data = m.data;
    const id = m.id;
    let eidx = this.editedlinkedTasks.findIndex(elm=>elm.id==id);
    this.editedlinkedTasks.splice(eidx,1);
    delete m.state;
    this.onEditLinkage.emit({editedlinkages: this.editedlinkedTasks});
    this.common.presentToaster("The linkage has been restored for '"+m.data.taskTitle+"'. It'll be saved when the changes are saved.")
  }

  delinkSelectedTask(m,i){
    console.log("delinkSelectedTask", m, i)
    const data = m.data;
    const id = m.id;
    // if its already pending just delete it from the list
    if(m.state=='pending'){
      let eidx = this.editedlinkedTasks.findIndex(elm=>elm.id==id);
      this.editedlinkedTasks.splice(eidx,1);
      this.linkedTasks.splice(i,1);
    } else {
      this.editedlinkedTasks.push({...m,state: 'delete'});
      // now set the state as delete
      // m.state= 'delete';
    }
    this.onEditLinkage.emit({linkages: this.linkedTasks, editedlinkages: this.editedlinkedTasks});

    this.common.presentToaster("'"+m.data.taskTitle+"' has been removed from the list of linked task. It'll be saved when the changes are saved.")
    console.log("delinkSelectedTask", this.linkedTasks, this.editedlinkedTasks)
  }

}
