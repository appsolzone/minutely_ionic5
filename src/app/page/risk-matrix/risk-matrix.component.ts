import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-risk-matrix',
  templateUrl: './risk-matrix.component.html',
  styleUrls: ['./risk-matrix.component.scss'],
})
export class RiskMatrixComponent implements OnInit {
  @Input() addPadding: boolean = false;
  @Input() labelFont: string = 'small';
  @Input() highLightCells: any={
    LowLow: null, LowMedium: null, MediumLow: null,
    MediumMedium: null, LowHigh: null, HighLow: null,
    MediumHigh: null, HighMedium: null, HighHigh: null
  };
  public matrixColor: any ={
    LowLow: 'success', LowMedium: 'warning', MediumLow: 'warning',
    MediumMedium: 'warning', LowHigh: 'warning', HighLow: 'warning',
    MediumHigh: 'danger', HighMedium: 'danger', HighHigh: 'danger'
  };

  constructor() { }

  ngOnInit() {
    console.log("risk matrix values input", this.highLightCells)
  }
  ngOnChanges() {
    console.log("risk matrix values input on changes", this.highLightCells)
  }

}
