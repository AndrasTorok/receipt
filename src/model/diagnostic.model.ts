import { Patient } from './patient.model';
import { CommonEntity, IValidity } from '../common/common.entity';

export class Diagnostic extends CommonEntity<Diagnostic> implements IDiagnostic {
    Id: number;
    PatientId: number;
    Patient: Patient;
    Description: string;
    Localization: string;
    Date: Date;

    constructor(diagnosticOrId: IDiagnostic | number) {
        super(Diagnostic.validityMap);
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

    static validityMap = new Map<string, IValidity<Diagnostic>[]>([
        ['Description',
            [{
                rule: (entity: Diagnostic) => !!entity.Description,
                message: (entity: Diagnostic) => `Diagnosticul trebuie sa fie specificat.`
            },
            {
                rule: (entity: Diagnostic) => !entity.Description || entity.Description.length >= 2,
                message: (entity: Diagnostic) => `Diagnosticul trebuie sa contina minim 2 caractere.`
            }]
        ],
        ['Localization',
            [{
                rule: (entity: Diagnostic) => !!entity.Localization,
                message: (entity: Diagnostic) => `Localizarea trebuie sa fie specificata.`
            },
            {
                rule: (entity: Diagnostic) => !entity.Localization || entity.Localization.length >= 2,
                message: (entity: Diagnostic) => `Localizarea trebuie sa contina minim 2 caractere.`
            }]
        ],
        ['Date',
            [{
                rule: (entity: Diagnostic) => !!entity.Date,
                message: (entity: Diagnostic) => `Data trebuie sa fie specificata.`
            }
            ]
        ]
    ]);

}

export interface IDiagnostic {
    Id: number;
    PatientId: number;
    Patient: Patient;
    Description: string;
    Localization: string;
    Date: Date;
}