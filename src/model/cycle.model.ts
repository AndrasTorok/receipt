import { Diagnostic } from './diagnostic.model';
import { Treatment } from './treatment.model';
import { CycleItem, ICycleItem } from './cycle-item.model';
import { CommonEntity, IValidity, Validity } from '../common/common.entity';
import { DoseApplicationMode } from './medicament.model';

export class Cycle extends CommonEntity<Cycle> implements ICycle {
    Id: number;
    DiagnosticId: number;
    Diagnostic: Diagnostic;
    TreatmentId: number;
    Treatment: Treatment;
    StartDate: Date;
    SerumCreat: number;
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
        ['CycleItems',
            [{
                rule: (entity: Cycle) => !entity.CycleItems || !entity.CycleItems.some(ci => !ci.$valid()),
                message: (entity: Cycle) => ``
            }]
        ]
    ]);

    constructor(cycleOrDiagnosticId: ICycle | number) {
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
                CycleItems: []
            };
        } else cycle = <ICycle>cycleOrDiagnosticId;

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
}

export interface ICycle {
    Id: number;
    DiagnosticId: number;
    Diagnostic: Diagnostic;
    TreatmentId: number;
    Treatment: Treatment;
    StartDate: Date;
    SerumCreat?: number;
    CycleItems: ICycleItem[];
}