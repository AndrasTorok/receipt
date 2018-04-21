import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { Medicament, IMedicament } from './medicament.model';
import { MessageService } from '../messages/message.service';

@Injectable()
export class MedicamentService extends ServiceBase<Medicament> {

    constructor(http: Http, messageService: MessageService, config: AppConfig) {
        super(http, messageService, config, 'medicament');
    }
}