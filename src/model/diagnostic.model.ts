import { Patient } from './patient.model';

export class Diagnostic implements IDiagnostic {
    Id: number;
    PatientId: number;
    Patient: Patient;
    Description: string;
    Localization: string;
    Date: Date;

    constructor(diagnosticOrId: IDiagnostic | number) {
        let diagnostic: IDiagnostic;

        if (Number.isInteger(<number>diagnosticOrId)) {
            diagnostic = <IDiagnostic>{
                Id: 0,
                PatientId: <number>diagnosticOrId,
                Patient: null,
                Description: '',
                Localization: '',
                Date: new Date()
            };
        } else diagnostic = <IDiagnostic>diagnosticOrId;

        for (var prop in diagnostic) {
            this[prop] = diagnostic[prop];
        }

        this.Date = new Date(diagnostic.Date.toString());
    }
}

export interface IDiagnostic {
    Id: number;
    PatientId: number;
    Patient: Patient;
    Description: string;
    Localization: string;
    Date: Date;
}