import { Injectable } from '@angular/core';
import { Patient } from './patient.model';
import { Http } from '@angular/http';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';

@Injectable()
export class PatientService extends ServiceBase<Patient> {    

    constructor(http : Http, config: AppConfig) {
        super(http, config, 'patient');                   
    }    
}