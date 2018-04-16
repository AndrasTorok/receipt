import { Diagnostic } from './diagnostic.model';
import { Treatment } from './treatment.model';
import { CycleItem, ICycleItem } from './cycle-item.model';
import { CommonEntity, IValidity, Validity } from '../common/common.entity';
import { DoseApplicationMode } from './medicament.model';
import { Calculation } from '../common/helpers';
import { Gender } from './patient.model';

export class Cycle extends CommonEntity<Cycle> implements ICycle {
    Id: number;
    DiagnosticId: number;
    Diagnostic: Diagnostic;
    TreatmentId: number;
    Treatment: Treatment;
    StartDate: Date;
    SerumCreat: number;
    Height: number;
    Weight: number;    
    BirthDate: Date;                     //property exists only on GUI
    Gender: Gender;                     //property exists only on GUI
    CycleItems: CycleItem[];

    static validityMap = new Map<string, IValidity<Cycle>[]>([
        ['Diagnostic',
            [{
                rule: (entity: Cycle) => !!entity.DiagnosticId || !!entity.Diagnostic,
                message: (entity: Cycle) => `Diagnostic trebuie sa fie specificat.`
            }]
        ],
        ['Treatment',
            [{
                rule: (entity: Cycle) => !!entity.TreatmentId || !!entity.Treatment,
                message: (entity: Cycle) => `Tratementul pacientului trebuie sa fie specificat.`
            }]
        ],
        ['StartDate',
            [{
                rule: (entity: Cycle) => !!entity.StartDate,
                message: (entity: Cycle) => `Data de inceput ciclului de tratament trebuie sa fie specificata.`
            }],
        ],
        ['SerumCreat',
            [{
                rule: (entity: Cycle) => {
                    return !entity.Treatment || !entity.Treatment.IsSerumCreatNeeded || entity.Treatment.IsSerumCreatNeeded && !!entity.SerumCreat;
                },
                message: (entity: Cycle) => `Data de inceput ciclului de tratament trebuie sa fie specificata.`
            }
            ]
        ],
        ['Height', 
            [
                {
                    rule: (entity: Cycle) => !!entity.Height ,
                    message: (entity: Cycle) => `Inaltimea patientului trebuie sa fie specificata.`
                },
                {
                    rule: (entity: Cycle) => !entity.Height || (entity.Height>=60 && entity.Height<=260 ),
                    message: (entity: Cycle) => `Inaltimea patientului trebuie sa fie intre 60 si 260 cm.`
                }                
            ]

        ],
        ['Weight', 
            [
                {
                    rule: (entity: Cycle) => !!entity.Weight ,
                    message: (entity: Cycle) => `Greutatea patientului trebuie sa fie specificata.`
                } ,
                {
                    rule: (entity: Cycle) => !entity.Weight || (entity.Weight>=20 && entity.Weight<=500 ),
                    message: (entity: Cycle) => `Greutatea patientului trebuie sa fie intre 20 si 500 cm.`
                }              
            ]

        ],
        ['CycleItems',
            [{
                rule: (entity: Cycle) => !entity.CycleItems || !entity.CycleItems.some(ci => !ci.$valid()),
                message: (entity: Cycle) => ``
            }]
        ]
    ]);

    constructor(cycleOrDiagnosticId: ICycle | number, gender: Gender, birthDate: Date, height?: number, weight?: number) {
        super(Cycle.validityMap);
        let cycle: ICycle;

        if (Number.isInteger(<number>cycleOrDiagnosticId)) {
            cycle = <ICycle>{
                Id: 0,
                DiagnosticId: <number>cycleOrDiagnosticId,
                Diagnostic: null,
                TreatmentId: 0,
                Treatment: null,
                StartDate: new Date(),
                SerumCreat: null,                
                Height: height,
                Weight: weight,
                BirthDate: birthDate,
                Gender: gender,
                CycleItems: []
            };
        } else {
            cycle = <ICycle>cycleOrDiagnosticId;
            cycle.BirthDate= birthDate;
            cycle.Gender = gender;
        }

        if(!cycle.Height) cycle.Height = height;
        if(!cycle.Weight) cycle.Weight = weight;

        for (var prop in cycle) {
            this[prop] = cycle[prop];
        }

        if (cycle.CycleItems) {
            this.CycleItems = cycle.CycleItems.map(ci => new CycleItem(ci));
        }

        this.StartDate = new Date(cycle.StartDate.toString());
    }

    get isSerumCreatNeeded(): boolean {
        return this.Treatment && this.Treatment.IsSerumCreatNeeded;
    }

    get bodySurfaceArea(): number {
        return Calculation.bodySurfaceArea(this.Height, this.Weight);
    }

    get age(): number{
        return Calculation.age(this.BirthDate, this.StartDate);
    }
}

export interface ICycle {
    Id: number;
    DiagnosticId: number;
    Diagnostic: Diagnostic;
    TreatmentId: number;
    Treatment: Treatment;
    StartDate: Date;
    SerumCreat?: number;    
    Height: number;
    Weight: number;
    BirthDate: Date;
    Gender: Gender;  
    CycleItems: ICycleItem[];
}