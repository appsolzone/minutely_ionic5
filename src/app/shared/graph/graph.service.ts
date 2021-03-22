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
      graphY.maxValue = Math.ceil(graphY.maxValue.toFixed(1)*1);
      graphX.maxValue = effort!=0 ? effort : 1;
      // now get the billable amounts
      let bills$ = summeries && summeries.details ? Object.keys(summeries.details).map(d=>summeries.details[d].billingAmount) : [];
      graphY$.maxValue = bills$.length > 0 ? Math.max(...bills$) : 1;
      graphY$.maxValue = Math.ceil(graphY$.maxValue.toFixed(1)*1);
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

  processTeamViewUserSummary(allSummeriesArray,viewMode='monthly', startPeriod=null, endPeriod=null){
    let colorStack = [...this.colorStack];
    let userList = {};
    let summeriesArray = [];
    console.log("summeriesArray viewMode",viewMode, startPeriod, endPeriod)
    if(!startPeriod || !endPeriod){
      summeriesArray = allSummeriesArray;
    } else {
      if(viewMode=='monthly'){
        let startMonth = moment(startPeriod).format('YYYYMM');
        let endMonth = moment(endPeriod).format('YYYYMM');
        summeriesArray = allSummeriesArray.filter(as=>as.data.yearMonth>=startMonth && as.data.yearMonth<=endMonth);
        console.log("summeriesArray",startMonth,endMonth,summeriesArray)
      } else {
        let startMonth = moment(startPeriod).startOf('isoWeek').format('YYYYMM');
        let endMonth = moment(startPeriod).endOf('isoWeek').format('YYYYMM');
        let startOfWeek = moment(startPeriod).startOf('isoWeek').format('YYYYMMDD');
        let endOfWeek = moment(startPeriod).endOf('isoWeek').format('YYYYMMDD');
        let monthlySummeriesArray = allSummeriesArray.filter(as=>as.data.yearMonth>=startMonth && as.data.yearMonth<=endMonth);
        summeriesArray = [];
        console.log("monthlySummeriesArray",startMonth,endMonth,startOfWeek,endOfWeek,monthlySummeriesArray)
        monthlySummeriesArray.forEach(sa=>{
          // usersummary data model
          // activities {map}
          // projects {map}
          // details { map of date}
          let weeklySa = {id: sa.id, data: { ...sa.data, effort:0, billingAmount: 0, details: {}, activities: {}, projects: {}} };
          Object.keys(sa.data.details).forEach(d=>{
            if(d >= startOfWeek && d<=endOfWeek){
              let dAct = sa.data.details[d];
              weeklySa.data.details[d]=dAct;
              weeklySa.data.effort += dAct.effort;
              weeklySa.data.billingAmount += dAct.billingAmount;
              Object.keys(dAct).forEach(act=>{
                if(dAct[act].project){
                  // console.log("debug", dAct, act, dAct[act].project, d);
                  if(weeklySa.data.projects[dAct[act].project.projectId]){
                    weeklySa.data.projects[dAct[act].project.projectId].effort += dAct[act].effort;
                    weeklySa.data.projects[dAct[act].project.projectId].billingAmount += dAct[act].billingAmount;
                  } else {
                    weeklySa.data.projects[dAct[act].project.projectId] = { worked: true, title: dAct[act].project.title, effort : dAct[act].effort, billingAmount: dAct[act].billingAmount };
                  }
                  if(weeklySa.data.activities[act]){
                    weeklySa.data.activities[act].effort += dAct[act].effort;
                    weeklySa.data.activities[act].billingAmount += dAct[act].billingAmount;
                  } else {
                    weeklySa.data.activities[act] = { worked: true, title: dAct[act].project.title, name: dAct[act].name, effort : dAct[act].effort, billingAmount: dAct[act].billingAmount };
                  }
                }

              });

            }
          });
          console.log("weeklysa", weeklySa);
          let projectList = Object.keys(weeklySa.data.projects);
          let activityList = Object.keys(weeklySa.data.activities);
          let monthMedium = moment('2021-'+weeklySa.data.month+'-01').format('MMM');
          let year = weeklySa.data.yearMonth.substr(0,4);
          summeriesArray.push({...weeklySa, projectList, activityList, monthMedium, year});
        });
      }
    }


    let graphX: any={ ...this.graphX, data: [], icon: 'body', title: 'Efforts by team members (in hr)',  };
    let graphX$: any={ ...this.graphX, data: [], icon: 'body', title: 'Billable amounts per team member (in $)', };
    summeriesArray.forEach(sa=>{
      let stackCssClass = 'primary';
      if(userList[sa.data.uid]){
        stackCssClass = userList[sa.data.uid];
      } else {
        stackCssClass = colorStack[(Object.keys(userList).length+1)%colorStack.length - 1];
        userList[sa.data.uid] = stackCssClass;
      }
      // now create graphX stack
      let uidIdx = graphX.data.findIndex(p=>p.uid==sa.data.uid);
      if(uidIdx==-1){
        // create new entry
        let newUserObj = {
          uid: sa.data.uid,
          label: sa.data.name,
          value: sa.data.effort,
          labelValue: this.getRepresentabletext(sa.data.effort,'efforts'), //.toFixed(2) + ' hr',
          stack: [{cssClass: stackCssClass, width: 0}]
        };
        graphX.data.push({...newUserObj})
        // billing amount entries
        let newUserObj$ = {
          uid: sa.data.uid,
          label: sa.data.name,
          value: sa.data.billingAmount,
          labelValue: this.getRepresentabletext(sa.data.billingAmount,'billingAmount'), //'$ ' + activity.billingAmount.toFixed(2),
          stack: [{cssClass: stackCssClass, width: 0}]
        };
        graphX$.data.push({...newUserObj$})
      } else {
        graphX.data[uidIdx].value = (sa.data.effort + graphX.data[uidIdx].value * 1); //.toFixed(2);
        graphX.data[uidIdx].labelValue = this.getRepresentabletext(graphX.data[uidIdx].value,'efforts');
        // graphX.data[uidIdx].stack[0].width = (graphX.data[actIdx].value*100/graphX.maxValue);
        // billing amount entries
        graphX$.data[uidIdx].value = (sa.data.billingAmount + graphX$.data[uidIdx].value * 1); //.toFixed(2);
        graphX$.data[uidIdx].labelValue = this.getRepresentabletext(graphX$.data[uidIdx].value,'billingAmount');
        // graphX$.data[uidIdx].stack[0].width = (graphX$.data[actIdx].value*100/graphX$.maxValue);
      }

    });
    let efforts = graphX.data.map(d=>d.value);
    graphX.maxValue = Math.max(...efforts);
    graphX.maxValue = graphX.maxValue==0 ? 1 : graphX.maxValue;
    let billingAmount = graphX$.data.map(d=>d.value);
    graphX$.maxValue = Math.max(...billingAmount);
    graphX$.maxValue = graphX$.maxValue == 0 ? 1 : graphX$.maxValue;

    graphX.data.forEach((gd,i)=>{
      gd.stack[0].width = (gd.value*100/graphX.maxValue);
      graphX$.data[i].stack[0].width = (graphX$.data[i].value*100/graphX$.maxValue);
    })

    return { summeriesArray, graphX, graphX$ };

  }

  createProjectSummaryGraph(summeriesArray, years){
    // summeriesArray is an array with the follwoing structure
    // activities: A1:{billingAmount, effort, name}, A2:{billingAmount, effort, name}
    // months: 01:{billingAmount, effort}, 02:{}
    // billingAmount:,
    // effort:
    // lets create graph with the following
    // Graph:{graphXEffort, graphXCost, graphYEffort, graphYCost}

    let graph: any = {
          graphY: { ...this.graphY, data: [], icon: 'stats-chart', title: 'Monthly efforts for the project (in hr)', },
          graphX: { ...this.graphX, data: [], icon: 'body', title: 'Efforts for project activities (in hr)', },
          graphY$: { ...this.graphY, data: [], icon: 'stats-chart', title: 'Monthly billing amounts for the project (in $)', },
          graphX$: { ...this.graphX, data: [], icon: 'body', title: 'Project costs for the activities (in $)', },
          graphCombinedX: { ...this.graphX, data: [], icon: 'body', title: 'Yearly efforts for project activities (in hr)', },
          graphCombinedX$: { ...this.graphX, data: [], icon: 'body', title: 'Yearly cost for the project (in $)', },
        };
    // Lets get the max values
    let efforts = [];
    let bills$ = [];
    let combinedX: any = {};
    let combinedX$: any = {};

    summeriesArray.forEach(s=>{
                  let summeries = s.data;
                  let maxX = 0;
                  let maxX$ = 0;
                  if(summeries.months){
                    let effortstoAdd = Object.keys(summeries.months).map(m=>summeries.months[m].effort);
                    let billstoAdd = Object.keys(summeries.months).map(m=>summeries.months[m].billingAmount);
                    Object.keys(summeries.activities).forEach(a=>{
                      maxX += summeries.activities[a].effort;
                      maxX$ += summeries.activities[a].billingAmount;
                      combinedX[a] = combinedX[a] ? (combinedX[a] + summeries.activities[a].effort) : summeries.activities[a].effort;
                      combinedX$[a] = combinedX$[a] ? (combinedX$[a] + summeries.activities[a].billingAmount) : summeries.activities[a].billingAmount;
                    });
                    efforts = [...efforts, ...effortstoAdd]
                    bills$ = [...bills$, ...billstoAdd]
                    graph.graphCombinedX.maxValue = graph.graphCombinedX.maxValue > maxX ? graph.graphCombinedX.maxValue : maxX;
                    graph.graphCombinedX$.maxValue = graph.graphCombinedX$.maxValue > maxX$ ? graph.graphCombinedX$.maxValue : maxX$;
                    // console.log("log",Object.keys(combinedX$).map(e=>combinedX$[e]), combinedX$, effortstoAdd,billstoAdd,efforts,bills$)
                  }
                });
    graph.graphY.maxValue = efforts.length > 0 ? Math.max(...efforts) : 1;
    graph.graphY.maxValue = Math.ceil(graph.graphY.maxValue.toFixed(1)*1);
    graph.graphX.maxValue = Object.keys(combinedX).length > 0 ? Math.max(...Object.keys(combinedX).map(e=>combinedX[e])) : 1;
    // now get the billable amounts
    graph.graphY$.maxValue = bills$.length > 0 ? Math.max(...bills$) : 1;
    graph.graphY$.maxValue = Math.ceil(graph.graphY$.maxValue.toFixed(1)*1);
    graph.graphX$.maxValue = Object.keys(combinedX$).length > 0 ? Math.max(...Object.keys(combinedX$).map(e=>combinedX$[e])) : 1;

    graph.graphY.xAxisFrequency = years.length == 1 ? 3 : years.length <= 3 ? 6 : 12; //Math.floor(this.graphY.data.length/4);
    graph.graphY$.xAxisFrequency = years.length == 1 ? 3 : years.length <= 3 ? 6 : 12;

    let activityList = {};
    let yearList = {};
    years.sort((a,b)=>a-b).forEach(y=>{
      let sa: any;
      let saIdx = summeriesArray.findIndex(sa=>parseInt(sa.data.year)==y);
      if(saIdx!=-1){
        sa = summeriesArray[saIdx];
      } else {
        sa = {
                data:{
                  activities:{},
                  billingAmount: 0,
                  effort: 0,
                  months: {},
                  projectId: summeriesArray[0]?.projectId ? summeriesArray[0]?.projectId : 'PRJ1',
                  subscriberId: null,
                  title: '',
                  year: (y + '')
                }
              };

      }
      this.createyearlyProjectSummaryGraph(sa.data, graph, activityList, yearList);
    });
    return graph;
  }
  createyearlyProjectSummaryGraph(yearlySummary, graph, activityList, yearList){
    let colorStack = [...this.colorStack];
    let summeries = yearlySummary ? yearlySummary : null;
    let effort = summeries ? summeries.effort : 0;
    let billingAmount = summeries ? summeries.billingAmount : 0;
    let noofmonths: number = 12;
    let totalEffort = effort;
    let avgEffort = effort/noofmonths;
    // if its a large value represent differently
    let yearlyBillingAmount = billingAmount >= 1000000 ?
                                (billingAmount/1000000).toFixed(1) + ' M'
                                :
                                billingAmount >= 1000 ?
                                (billingAmount/1000).toFixed(1) + ' K'
                                :
                                (billingAmount).toFixed(2);
    let { graphX, graphX$, graphY, graphY$, graphCombinedX, graphCombinedX$ } = graph;


    if(summeries){
      // let efforts = summeries && summeries.months ? Object.keys(summeries.months).map(m=>summeries.months[m].effort) : [];
      // graphY.maxValue = efforts.length > 0 ? Math.max(...efforts) : 1;
      // graphY.maxValue = graphY.maxValue.toFixed(1)*1;
      // graphX.maxValue = effort!=0 ? effort : 1;
      // // now get the billable amounts
      // let bills$ = summeries && summeries.months ? Object.keys(summeries.months).map(m=>summeries.months[m].billingAmount) : [];
      // graphY$.maxValue = bills$.length > 0 ? Math.max(...bills$) : 1;
      // graphY$.maxValue = graphY$.maxValue.toFixed(1)*1;
      // graphX$.maxValue = billingAmount!=0 ? billingAmount : 1;

      // graphX
      // console.log("yearlySummary", yearlySummary, graph);
      Object.keys(summeries.activities).forEach(act=>{
        let activity = summeries.activities[act];
        let stackCssClass: any;
        if(activityList[act]){
          stackCssClass = activityList[act];
        } else {
          stackCssClass = colorStack[(Object.keys(activityList).length+1)%colorStack.length - 1];
          activityList[act] = stackCssClass
        }
        // now create graphX stack
        let actIdx = graphX.data.findIndex(p=>p.activityId==act);
        if(actIdx==-1){
          // create new entry
          let newActObj = {
            activityId: act,
            label: activity.name,
            value: activity.effort,
            labelValue: this.getRepresentabletext(activity.effort,'efforts'), //.toFixed(2) + ' hr',
            stack: [{cssClass: stackCssClass, width: (activity.effort*100/graphX.maxValue)}]
          };
          graphX.data.push({...newActObj})
          // billing amount entries
          let newActObj$ = {
            activityId: act,
            label: activity.name,
            value: activity.billingAmount,
            labelValue: this.getRepresentabletext(activity.billingAmount,'billingAmount'), //'$ ' + activity.billingAmount.toFixed(2),
            stack: [{cssClass: stackCssClass, width: (activity.billingAmount*100/graphX$.maxValue)}]
          };
          graphX$.data.push({...newActObj$})
        } else {
          graphX.data[actIdx].value = (activity.effort + graphX.data[actIdx].value * 1); //.toFixed(2);
          graphX.data[actIdx].labelValue = this.getRepresentabletext(graphX.data[actIdx].value,'efforts');
          graphX.data[actIdx].stack[0].width = (graphX.data[actIdx].value*100/graphX.maxValue);
          // billing amount entries
          graphX$.data[actIdx].value = (activity.billingAmount + graphX$.data[actIdx].value * 1); //.toFixed(2);
          graphX$.data[actIdx].labelValue = this.getRepresentabletext(graphX$.data[actIdx].value,'billingAmount');
          graphX$.data[actIdx].stack[0].width = (graphX$.data[actIdx].value*100/graphX$.maxValue);
        }
      })

      let startDate = moment('2021-01-01').startOf('year');
      let yearstackCssClass: any;
      if(yearList[summeries?.year]){
        yearstackCssClass = activityList[summeries?.year];
      } else {
        yearstackCssClass = colorStack[(Object.keys(yearList).length+1)%colorStack.length - 1];
        yearList[summeries?.year] = yearstackCssClass
      }
      let combinedXdataObj: any = {
        label: 'Efforts for ' + summeries?.year,
        labelValue: 0,
        stack: [{cssClass: yearstackCssClass, width: 0}]
      };
      let combinedXdataObj$: any = {
        label: 'Cost for ' + summeries?.year,
        labelValue: 0,
        stack: [{cssClass: yearstackCssClass, width: 0}]
      };
      while(startDate<=moment('2021-01-01').endOf('year')){
        // loop through the days
        let month = moment(startDate).format('MM');
        let dataObj:any = {};
        // billing amount obj
        let dataObj$:any = {};

        if(summeries.months[month]){
          let activity = summeries.months[month];
          dataObj = {
            label: moment(startDate).format('MMM'),
            month: moment(startDate).format('MM'),
            labelValue: '',
            stack: []
          };
          let cumTotalheight = 0;
          // billing amount related values
          dataObj$ = {
            label: moment(startDate).format('MMM'),
            month: moment(startDate).format('MM'),
            labelValue: '',
            stack: []
          };
          let cumTotalheight$ = 0;

          cumTotalheight += (activity.effort*100/graphY.maxValue);
          dataObj.stack.push({cssClass: yearstackCssClass, height: cumTotalheight});
          // billing amount
          cumTotalheight$ += (activity.billingAmount*100/graphY$.maxValue);
          dataObj$.stack.push({cssClass: yearstackCssClass, height: cumTotalheight$});
          // combined amounts
          combinedXdataObj.stack[0].width += (activity.effort*100/graphCombinedX.maxValue);
          combinedXdataObj.labelValue += (activity.effort);
          combinedXdataObj$.stack[0].width += (activity.billingAmount*100/graphCombinedX$.maxValue);
          combinedXdataObj$.labelValue += (activity.billingAmount);
        } else {
          dataObj = {
            label: moment(startDate).format('MMM'),
            month: moment(startDate).format('MM'),
            lavelValue: '',
            stack: [{cssClass: yearstackCssClass, height: 0}]
          }
          // billing amount
          dataObj$ = {
            label: moment(startDate).format('MMM'),
            month: moment(startDate).format('MM'),
            lavelValue: '',
            stack: [{cssClass: yearstackCssClass, height: 0}]
          }
        }
        graphY.data.push(dataObj);
        // billing amount
        graphY$.data.push(dataObj$);

        startDate = moment(startDate).add(1,'month');
      }

      combinedXdataObj.labelValue = this.getRepresentabletext(combinedXdataObj.labelValue,'efforts'); //.toFixed(2) + ' hr';
      combinedXdataObj$.labelValue = this.getRepresentabletext(combinedXdataObj$.labelValue,'billingAmount'); //'$ ' + combinedXdataObj$.labelValue.toFixed(2);
      graphCombinedX.data.push(combinedXdataObj);
      graphCombinedX$.data.push(combinedXdataObj$);

      // this.graphY = graphY;
    }
    // console.log("return graph", { totalEffort, avgEffort, yearlyBillingAmount , graphX, graphY });

    return { totalEffort, avgEffort, yearlyBillingAmount , graphX, graphY, graphX$, graphY$ };

  }

  getRepresentabletext(number, type){
    switch(type){
      case 'billingAmount':
        let ba = number >= 1000000 ?
                                    (number/1000000).toFixed(1) + ' M'
                                    :
                                    number >= 1000 ?
                                    (number/1000).toFixed(1) + ' K'
                                    :
                                    (number).toFixed(1);
        return '$ ' + ba;
      case 'efforts':
        let ef = number >= 1000000 ?
                                    (number/1000000).toFixed(1) + ' \'M'
                                    :
                                    number >= 1000 ?
                                    (number/1000).toFixed(1) + ' \'K'
                                    :
                                    (number).toFixed(1);
        return ef + ' hr';
    }

  }
}
