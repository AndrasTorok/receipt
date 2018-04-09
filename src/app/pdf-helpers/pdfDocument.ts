import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PdfViewer } from './pdfViewer';
import { PdfPage } from './pdfPage';
import { Font, Rectangle } from './helpers';

export abstract class PdfDocument {
    protected document: jsPDF;
    protected page: PdfPage;
    private pdfViewer: PdfViewer;

    constructor() {
        this.pdfViewer = new PdfViewer();
    }

    abstract createDocument(params: IPdfDocument);

    preview(params: IPdfDocument): void {
        this.page = new PdfPage();

        this.document = new jsPDF(this.page.orientation, this.page.unit, this.page.format);
        this.createDocument(params);
        this.pdfViewer.preview(this.document.output('datauristring'), 'Receipt');
    }

    protected getLines(text: string, font?: Font, leftIdent?: number): string[] {
        let textWidth = this.page.size.width - this.page.margin.left - this.page.margin.right,
            document: jsPDF = this.document;

        if (leftIdent) textWidth -= leftIdent;


        if (font) {
            document = document
                .setFont(font.fontName, font.fontStyle)
                .setFontSize(font.fontSize);            
        }

        let lines = this.document
            .splitTextToSize(text, textWidth);

        return lines;
    }

    protected drawActiveRectangle(): void {
        let size = this.page.size,
            margin = this.page.margin,
            width = size.width - margin.left - margin.right,
            height = size.height - margin.top - margin.bottom;


        this.document.rect(margin.left, margin.top, width, height);
    }
}

export interface IPdfDocument {

}

