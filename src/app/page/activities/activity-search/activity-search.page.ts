import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar';

@Component({
  selector: 'app-activity-search',
  templateUrl: './activity-search.page.html',
  styleUrls: ['./activity-search.page.scss'],
})
export class ActivitySearchPage implements OnInit {

  public options: CalendarComponentOptions = {
                                                pickMode: 'single',
                                                weekStart: 1,
                                              };
  public optionsRange: CalendarComponentOptions = {
                                                pickMode: 'range',
                                                weekStart: 1,
                                              };

  constructor() { }

  ngOnInit() {
    this.options.pickMode = 'range';
  }

  calendarOptionsChanged(e){
    let pickMode = {pickMode: e.detail.value};

    setTimeout(()=>{
        this.options = {...this.options, ...pickMode};
      }, 100);
  }

}
