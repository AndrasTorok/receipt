import { Injectable } from '@angular/core';
import { PdfDocument, IPdfDocument } from './pdfDocument';
import { Patient } from '../../model/patient.model';
import { DatePipe } from '@angular/common';

export interface IReceiptPdfDocument extends IPdfDocument {
    patient: Patient;
}

const LoremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

@Injectable()
export class ReceiptDocument extends PdfDocument {

    constructor(
        private datePipe: DatePipe
    ) {
        super();
    }


    createDocument(params: IReceiptPdfDocument): void {
        let firstNameDimension = this.document.getTextWidth(params.patient.FirstName),
            loremIpsumDimension = this.document.getTextWidth(LoremIpsum);

        this.drawActiveRectangle();

        this.document.setFontSize(10);
        this.personalDetails(params);

        let loremIpsumLines = this.getLines(LoremIpsum);

        this.document.text(loremIpsumLines, 10, 150)

    }

    private personalDetails(params: IReceiptPdfDocument): void {
        let left = 60,
            top = 20,
            height = 5,
            labelToTextDistance = 5;

        let items: IItem[] = [
            { label: 'Nume', text: params.patient.FirstName },
            { label: 'Prenume', text: params.patient.LastName },
            { label: 'Data nasterii', text: `${this.datePipe.transform(params.patient.BirthDate, 'yyyy-MM-dd')}          ${params.patient.Age} ani` }
        ];


        for(let index = 0; index < items.length; index++,top += height ){
            let item = items[index],
                labelWidth = this.document.getTextWidth(item.label);

            this.document.text(item.label, left- labelWidth - labelToTextDistance, top);
            this.document.text(item.text, left, top);
        }    
        
        this.document.text('Inaltime', 20, top);
        this.document.text(`${params.patient.Height.toString()} cm`, 40, top);

        this.document.text('Gerutate', 60, top);
        this.document.text(`${params.patient.Weight.toString()} Kg`, 80, top);

        this.document.text('Suprafata', 100, top);
        this.document.text(`${params.patient.BodySurfaceArea.toFixed(2)} mp`, 120, top);
    }
}

interface IItem {
    label: string;
    text: string;
}