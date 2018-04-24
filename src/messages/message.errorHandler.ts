import { ErrorHandler, Injectable } from "@angular/core";
import { MessageService } from "./message.service";
import { Message } from "./message.model";

@Injectable()
export class MessageErrorHandler implements ErrorHandler {

    constructor(private messageService: MessageService) {
    }

    handleError(error) {        
        let msg = error instanceof Error ? error.message : error.toString(),    
            messageTimer,        
            responses: [string, (string) => void][] = [
                ["OK", () => {
                    this.messageService.removeMessage();
                    clearTimeout(messageTimer);
                }]                
            ],
            message = new Message(msg, true, responses);

        if(msg == `Cannot read property 'Name' of null`) return;

        setTimeout(() => this.messageService.reportMessage(message), 0);
        messageTimer = setTimeout(()=>  this.messageService.removeMessage(), 5000);
    }
}