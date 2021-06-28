import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

    // calendar meta structure
    getCalendarMeta(){
     const calendarMeta: any = {
              newClendarDaysConfig: [],
              calendarOptions: {
                pickMode: 'single',
                weekStart: 1,
                from: new Date(moment().startOf('month').subtract(1, 'year').format('YYYY-MM-DD')),
                disableWeeks: [],
                daysConfig: [],
              },
          };
     return calendarMeta;
    }

    // render whole data in the array
    // only use this and send parameters
    renderDataSet(calendarMeta){
      setTimeout(() => {
        const newOptions = {
                                daysConfig: [...calendarMeta.newClendarDaysConfig]
                            };
        calendarMeta.calendarOptions = {
                                  ...calendarMeta.calendarOptions,
                                  ...newOptions
                              };
      }, 100);
    }

    // extract the activities records for the dates
    extractActivities(data,
                      calendarMeta,
                      yearMonth = null,
                    ){
      const newActivities = [];
      for (let i = 0; i < data.length; i++){
        let endDate = null;
        let startDate = null;
        const endOfMonth = yearMonth ? moment(yearMonth, 'YYYYMM').startOf('month').format('YYYY-MM-DD') : null;
        const startOfMonth = yearMonth ? moment(yearMonth, 'YYYYMM').endOf('month').format('YYYY-MM-DD') : null;
        // If the date is from firestore database we have .seconds attribute, then use it
        // else assume that this is a moment date type
        if (data[i].startDate.seconds){
          endDate = moment(data[i].endDate.seconds * 1000).format('YYYY-MM-DD');
          startDate = moment(data[i].startDate.seconds * 1000).format('YYYY-MM-DD');
        } else {
          endDate = moment(data[i].endDate).format('YYYY-MM-DD');
          startDate = moment(data[i].startDate).format('YYYY-MM-DD');
        }
        const status = data[i].status.toLowerCase();
        if (startDate == endDate){
          newActivities.push({date: new Date(startDate), cssClass: status + 'Date', desc: data[i].desc});
        }else{
          while (startDate <= endDate){
            newActivities.push({date: new Date(startDate), cssClass: status + 'Date', desc: data[i].desc});
            startDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD');
          }
        }
      }

      // Combine all leaves and holidays
      calendarMeta.newClendarDaysConfig = [...newActivities];
      this.renderDataSet(calendarMeta);
    }
}
