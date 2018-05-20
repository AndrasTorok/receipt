import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DatePipe, registerLocaleData } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular/main';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
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
import { CycleComponent } from './cycle/cycle.component';
import { CycleService } from '../model/cycle.service';
import { CycleDetailComponent } from './cycle-detail/cycle-detail.component';
import { ValidationComponent } from './validation/validation.component';
import { PatientDetailDisplayComponent } from './patient-detail-display/patient-detail-display.component';
import { MessageModule } from '../messages/message.module';
import { SearchComponent } from './search/search.component';
import { SearchService } from './search/search.service';
import { OrderByPipe } from '../common/orderBy.pipe';
import localeRo from '@angular/common/locales/ro';

const routes = RouterModule.forRoot([
  { path: 'welcome', component: WelcomeComponent },
  { path: 'patient', component: PatientComponent },
  { path: 'patient/:patientId', component: PatientDetailComponent },
  { path: 'patient/:patientId/diagnostic/:diagnosticId', component: DiagnosticDetailComponent },
  { path: 'patient/:patientId/diagnostic/:diagnosticId/cycle/:cycleId', component: CycleDetailComponent },
  { path: 'treatment', component: TreatmentComponent },
  { path: 'treatment/:treatmentId', component: TreatmentDetailComponent },
  { path: 'treatment/:treatmentId/item/:treatmentItemId', component: TreatmentItemComponent },
  { path: 'medicament', component: MedicamentComponent },
  { path: 'medicament/:medicamentId', component: MedicamentDetailComponent },
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
]);

export function initConfig(config: AppConfig) {
  return () => config.load();
}

registerLocaleData(localeRo, 'ro');

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PatientComponent,
    PatientDetailComponent,
    DiagnosticComponent,
    TreatmentComponent,
    DiagnosticDetailComponent,
    TreatmentDetailComponent,
    TreatmentItemComponent,
    MedicamentComponent,
    MedicamentDetailComponent,
    CycleComponent,
    CycleDetailComponent,
    ValidationComponent,
    PatientDetailDisplayComponent,
    SearchComponent,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    routes,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AgGridModule.withComponents([]),
    MessageModule
  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true },
    DatePipe,
    PatientService,
    TreatmentService,
    DiagnosticService,
    TreatmentItemService,
    MedicamentService,
    CycleService,
    { provide: 'Window', useValue: window },
    SearchService,
    OrderByPipe,
    { provide: LOCALE_ID, useValue: 'ro' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
