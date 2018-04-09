import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Patient, Gender } from '../../model/patient.model';

@Component({
  selector: 'app-receipt-pdf',
  templateUrl: './receipt-pdf.component.html',
  styleUrls: ['./receipt-pdf.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiptPdfComponent implements OnInit {
  @Input() patient: Patient;  

  constructor(
    

  ) {
    
  }

  ngOnInit() {

  }

  
}
