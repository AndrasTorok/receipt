import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular/main';
import { ReceiptDocument } from './pdf-helpers/receiptDocument';

import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { ReceiptPdfComponent } from './receipt-pdf/receipt-pdf.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PatientComponent } from './patient/patient.component';
import { PatientService } from '../model/patient.service';
import { Patient } from '../model/patient.model';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { DiagnosticComponent } from './diagnostic/diagnostic.component';
import { TreatmentComponent } from './treatment/treatment.component';
import { TreatmentService } from '../model/treatment.service';
import { DiagnosticDetailComponent } from './diagnostic-detail/diagnostic-detail.component';
import { DiagnosticService } from '../model/diagnostic.service';
import { TreatmentDetailComponent } from './treatment-detail/treatment-detail.component';
import { TreatmentItemComponent } from './treatment-item/treatment-item.component';
import { TreatmentItemService } from '../model/treatment-item.service';
import { MedicamentService } from '../model/medicament.service';
import { MedicamentComponent } from './medicament/medicament.component';
import { MedicamentDetailComponent } from './medicament-detail/medicament-detail.component';

let routes = RouterModule.forRoot([
  { path: 'welcome', component: WelcomeComponent },
  { path: 'patient', component: PatientComponent },
  { path: 'patient/:patientId', component: PatientDetailComponent },
  { path: 'patient/:patientId/diagnostic/:diagnosticId', component : DiagnosticDetailComponent },
  { path: 'treatment', component: TreatmentComponent },  
  { path: 'treatment/:treatmentId', component: TreatmentDetailComponent },
  { path: 'treatment/:treatmentId/item/:treatmentItemId', component: TreatmentItemComponent },  
  { path: 'medicament', component: MedicamentComponent },
  { path: 'medicament/:medicamentId', component: MedicamentDetailComponent }
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
]);

export function initConfig(config: AppConfig) {
  return () => config.load()
}

@NgModule({
  declarations: [
    AppComponent,
    ReceiptPdfComponent,
    WelcomeComponent,    
    PatientComponent,
    PatientDetailComponent,
    DiagnosticComponent,
    TreatmentComponent,
    DiagnosticDetailComponent,
    TreatmentDetailComponent,
    TreatmentItemComponent,
    MedicamentComponent,
    MedicamentDetailComponent       
  ],
  imports: [
    BrowserModule,
    routes,
    FormsModule,
    HttpModule,
    AgGridModule.withComponents([])
  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true },
    DatePipe,
    ReceiptDocument,
    PatientService,
    TreatmentService,
    DiagnosticService,
    TreatmentItemService,
    MedicamentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
