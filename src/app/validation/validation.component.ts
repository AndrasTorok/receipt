import { Component, OnInit, Input } from '@angular/core';
import { ICommonEntity } from '../../common/common.entity';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {

  @Input("entity") entity: ICommonEntity;
  @Input("property") property: string;

  constructor() { }

  ngOnInit() {
  }  

  ngOnChanges() {
    let entity = this.entity;

  }

  get showMessage() : boolean {
    let doShow = this.entity && !this.entity.$valid(this.property);

    return doShow;
  }

}
