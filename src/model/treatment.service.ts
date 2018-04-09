import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { Treatment, ITreatment } from './treatment.model';

@Injectable()
export class TreatmentService extends ServiceBase<Treatment> {    

    constructor(http : Http, config: AppConfig) {
        super(http, config, 'treatment');                   
    }    
}