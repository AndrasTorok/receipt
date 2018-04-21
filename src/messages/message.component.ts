import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MessageService } from './message.service';
import { Message } from './message.model';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationEnd, NavigationCancel } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'app-messages',
    moduleId: module.id,
    templateUrl: 'message.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class MessageComponent {
    lastMessage: Message;

    constructor(
        messageService: MessageService,
        router: Router,
        changeDetectorRef: ChangeDetectorRef
    ) {
        messageService.messages.subscribe(m => {
            this.lastMessage = m;
            changeDetectorRef.detectChanges();
        });

        router.events
            .filter(e => e instanceof NavigationEnd || e instanceof NavigationCancel)
            .subscribe(e => {
                this.lastMessage = null;
                changeDetectorRef.detectChanges();
            });
    }


}
