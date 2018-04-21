import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { TreatmentItem, ITreatmentItem } from './treatment-item.model';
import { MessageService } from '../messages/message.service';

@Injectable()
export class TreatmentItemService extends ServiceBase<TreatmentItem> {

    constructor(http: Http, messageService: MessageService, config: AppConfig) {
        super(http, messageService, config, 'treatmentItem');
    }
}