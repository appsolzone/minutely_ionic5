import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-bargraph',
  templateUrl: './bargraph.component.html',
  styleUrls: ['./bargraph.component.scss'],
})
export class BargraphComponent implements OnInit {

  @Input() graphX: any;
  @Input() graphY: any;
  @Input() graphYM: any;
  @Output() graphXClick = new EventEmitter<any>();
  @Output() graphYClick = new EventEmitter<any>();
  public graphYLabelMark: number; //= Math.floor(this.graphY ? this.graphY.data.length/4 : 1);
  // structure of graphX and graphY
  // {
  //  icon: ,
  //  title:,
  //  maxValue: , for graphY
  //  data: [
  //     {icon: form graph X, label:, labelValue, stack: [{cssClass, width: for x graph, height: y graph}]}
  //   ],
  // }
  // cssClass in built are primary, secondary, tertiary, warning, success, danger, pink, green

  constructor() { }

  ngOnInit() {
    if(this.graphY?.maxValue){
      this.graphY.halfValue = this.getRepresentabletext(this.graphY.maxValue*1/2, 'amount');
      this.graphY.maxValue = this.getRepresentabletext(this.graphY.maxValue*1, 'amount');
    }
    if(this.graphYM?.maxValue){
      this.graphYM.halfValue = this.getRepresentabletext(this.graphYM.maxValue*1/2, 'amount');
      this.graphYM.maxValue = this.getRepresentabletext(this.graphYM.maxValue*1, 'amount');
    }
  }

  clickX(x){
    console.log("clicked X", x)
    this.graphXClick.emit(x);
  }

  clickY(y){
    console.log("clicked Y", y)
    this.graphYClick.emit(y);
  }

  ngOnChanges(){
    if(this.graphY?.maxValue){
      this.graphY.halfValue = this.getRepresentabletext(this.graphY.maxValue*1/2, 'amount');
      this.graphY.maxValue = this.getRepresentabletext(this.graphY.maxValue*1, 'amount');
    }
    if(this.graphYM?.maxValue){
      this.graphYM.halfValue = this.getRepresentabletext(this.graphYM.maxValue*1/2, 'amount');
      this.graphYM.maxValue = this.getRepresentabletext(this.graphYM.maxValue*1, 'amount');
    }
  }

  getRepresentabletext(number, type){
    switch(type){
      case 'amount':
        let ba = number >= 1000000 ?
                                    (number/1000000).toFixed(0) + ' M'
                                    :
                                    number >= 1000 ?
                                    (number/1000).toFixed(0) + ' K'
                                    :
                                    (number).toFixed(0);
        return ba;
      // case 'efforts':
      //   let ef = number >= 1000000 ?
      //                               (number/1000000).toFixed(1) + ' \'M'
      //                               :
      //                               number >= 1000 ?
      //                               (number/1000).toFixed(1) + ' \'K'
      //                               :
      //                               (number).toFixed(1);
      //   return ef + ' hr';
    }

  }

}
