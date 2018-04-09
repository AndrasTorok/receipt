import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { Medicament, IMedicament } from './medicament.model';

@Injectable()
export class MedicamentService extends ServiceBase<Medicament> {    

    constructor(http : Http, config: AppConfig) {
        super(http, config, 'medicament');                   
    }    
}