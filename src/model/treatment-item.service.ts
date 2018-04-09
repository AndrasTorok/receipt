import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { TreatmentItem, ITreatmentItem } from './treatment-item.model';

@Injectable()
export class TreatmentItemService extends ServiceBase<TreatmentItem> {    

    constructor(http : Http, config: AppConfig) {
        super(http, config, 'treatmentItem');                   
    }    
}