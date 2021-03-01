import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  public colorStack: any[]= ['primary', 'warning', 'secondary', 'green', 'success','tertiary', 'danger', 'pink'];
  public graphY:any = {
      icon: 'stats-chart',
      title: 'Add your title here',
      maxValue: 1,
      data: [],
    };
  public graphX:any = {
      icon: 'stats-chart',
      title: 'Add your title here',
      maxValue: 1,
      data: [],
    };

  constructor() { }

  // callback function to process user summary data
  processUserSummary(summeriesArray,selectedMonth){
    let colorStack = [...this.colorStack];
    let projectList = {};
    let summeries = summeriesArray ? summeriesArray[0] : null;
    let effort = summeries ? summeries.effort : 0;
    let billingAmount = summeries ? summeries.billingAmount : 0;
    let noofdays: number = parseInt(moment(selectedMonth).endOf('month').format('DD'));
    let totalEffort = effort;
    let avgEffort = effort/noofdays;
    // if its a large value represent differently
    let monthlyBillingAmount = billingAmount >= 1000000 ?
                                (billingAmount/1000000).toFixed(1) + ' M'
                                :
                                billingAmount >= 1000 ?
                                (billingAmount/1000).toFixed(1) + ' K'
                                :
                                (billingAmount).toFixed(2);

    let graphY: any={ ...this.graphY, data: [] };
    let graphX: any={ ...this.graphX, data: [] };
    let graphY$: any={ ...this.graphY, data: [] };
    let graphX$: any={ ...this.graphX, data: [] };

    if(summeries){
      let efforts = summeries && summeries.details ? Object.keys(summeries.details).map(d=>summeries.details[d].effort) : [];
      graphY.maxValue = efforts.length > 0 ? Math.max(...efforts) : 1;
      graphY.maxValue = graphY.maxValue.toFixed(1)*1;
      graphX.maxValue = effort!=0 ? effort : 1;
      // now get the billable amounts
      let bills$ = summeries && summeries.details ? Object.keys(summeries.details).map(d=>summeries.details[d].billingAmount) : [];
      graphY$.maxValue = bills$.length > 0 ? Math.max(...bills$) : 1;
      graphY$.maxValue = graphY$.maxValue.toFixed(1)*1;
      graphX$.maxValue = billingAmount!=0 ? billingAmount : 1;

      let startDate = moment(selectedMonth).startOf('month');
      while(startDate<=moment(selectedMonth).endOf('month')){
        // loop through the days
        let day = moment(startDate).format('YYYYMMDD');
        let dataObj:any = {};
        // billing amount obj
        let dataObj$:any = {};

        if(summeries.details[day]){
          dataObj = {
            label: moment(startDate).format('DD'),
            labelValue: '',
            stack: []
          };
          let cumTotalheight = 0;
          // billing amount related values
          dataObj$ = {
            label: moment(startDate).format('DD'),
            labelValue: '',
            stack: []
          };
          let cumTotalheight$ = 0;

          Object.keys(summeries.details[day]).sort().forEach(act=>{
            let activity = summeries.details[day][act];
            let stackCssClass = 'primary';
            if(activity.project){
              if(projectList[activity.project?.projectId]){
                stackCssClass = projectList[activity.project?.projectId];
              } else {
                stackCssClass = colorStack[(Object.keys(projectList).length+1)%colorStack.length - 1];
                projectList[activity.project?.projectId] = stackCssClass
              }
              let dailyObjIdx = dataObj.stack.findIndex(p=>p.projectId==activity.project?.projectId);
              if(dailyObjIdx==-1){
                cumTotalheight += (activity.effort*100/graphY.maxValue);
                dataObj.stack.push({projectId: activity.project?.projectId, cssClass: stackCssClass, height: cumTotalheight});
                // billing amount
                cumTotalheight$ += (activity.billingAmount*100/graphY$.maxValue);
                dataObj$.stack.push({projectId: activity.project?.projectId, cssClass: stackCssClass, height: cumTotalheight$});
              } else{
                cumTotalheight += (activity.effort*100/graphY.maxValue);
                dataObj.stack[dailyObjIdx].height += (activity.effort*100/graphY.maxValue);
                // billing amount
                cumTotalheight$ += (activity.billingAmount*100/graphY$.maxValue);
                dataObj$.stack[dailyObjIdx].height += (activity.billingAmount*100/graphY$.maxValue);
              }

              // now create graphX stack
              let projectObjIdx = graphX.data.findIndex(p=>p.projectId==activity.project?.projectId);
              if(projectObjIdx==-1){
                // create new entry
                let newProjObj = {
                  projectId: activity.project?.projectId,
                  label: activity.project?.title,
                  labelValue: activity.effort.toFixed(2),
                  stack: [{cssClass: stackCssClass, width: (activity.effort*100/graphX.maxValue)}]
                };
                graphX.data.push({...newProjObj})
                // billing amount entries
                let newProjObj$ = {
                  projectId: activity.project?.projectId,
                  label: activity.project?.title,
                  labelValue: activity.billingAmount.toFixed(2),
                  stack: [{cssClass: stackCssClass, width: (activity.billingAmount*100/graphX$.maxValue)}]
                };
                graphX$.data.push({...newProjObj$})
              } else {
                graphX.data[projectObjIdx].labelValue = (activity.effort + graphX.data[projectObjIdx].labelValue * 1).toFixed(2);
                graphX.data[projectObjIdx].stack[0].width = (graphX.data[projectObjIdx].labelValue*100/graphX.maxValue);
                // billing amount entries
                graphX$.data[projectObjIdx].labelValue = (activity.billingAmount + graphX$.data[projectObjIdx].labelValue * 1).toFixed(2);
                graphX$.data[projectObjIdx].stack[0].width = (graphX$.data[projectObjIdx].labelValue*100/graphX$.maxValue);
              }
            }
          })
        } else {
          dataObj = {
            label: moment(startDate).format('DD'),
            lavelValue: '',
            stack: [{cssClass: 'secondary', height: 0}]
          }
          // billing amount
          dataObj$ = {
            label: moment(startDate).format('DD'),
            lavelValue: '',
            stack: [{cssClass: 'secondary', height: 0}]
          }
        }
        graphY.data.push(dataObj);
        // billing amount
        graphY$.data.push(dataObj$);

        startDate = moment(startDate).add(1,'day');
      }

      // this.graphY = graphY;
      // this.graphY.xAxisFrequency = Math.floor(this.graphY.data.length/4);
    }
    // console.log("return graph", { totalEffort, avgEffort, monthlyBillingAmount , graphX, graphY });

    return { totalEffort, avgEffort, monthlyBillingAmount , graphX, graphY, graphX$, graphY$ };

  }
}
