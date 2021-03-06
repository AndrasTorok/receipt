import { Diagnostic } from './diagnostic.model';
import { Treatment } from './treatment.model';
import { TreatmentItem } from './treatment-item.model';
import { CycleItem, ICycleItem } from './cycle-item.model';
import { CommonEntity, IValidity, Validity } from '../common/common.entity';
import { DoseApplicationMode } from './medicament.model';
import { Patient, Gender } from './patient.model';
import { Medicament } from './medicament.model';

export class Cycle extends CommonEntity<Cycle> implements ICycle {
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
                    return !entity.Treatment || !entity.Treatment.IsSerumCreatNeeded ||
                        entity.Treatment.IsSerumCreatNeeded && !!entity.SerumCreat;
                },
                message: (entity: Cycle) => `Creatina pacientului trebuie sa fie specificata.`
            }
            ]
        ],
        ['Height',
            [
                {
                    rule: (entity: Cycle) => !!entity.Height,
                    message: (entity: Cycle) => `Inaltimea patientului trebuie sa fie specificata.`
                },
                {
                    rule: (entity: Cycle) => !entity.Height || (entity.Height >= 60 && entity.Height <= 260),
                    message: (entity: Cycle) => `Inaltimea patientului trebuie sa fie intre 60 si 260 cm.`
                }
            ]

        ],
        ['Weight',
            [
                {
                    rule: (entity: Cycle) => !!entity.Weight,
                    message: (entity: Cycle) => `Greutatea patientului trebuie sa fie specificata.`
                },
                {
                    rule: (entity: Cycle) => !entity.Weight || (entity.Weight >= 20 && entity.Weight <= 500),
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

    Id: number;
    DiagnosticId: number;
    Diagnostic: Diagnostic;
    TreatmentId: number;
    Treatment: Treatment;
    StartDate: Date;
    SerumCreat: number;
    Height: number;
    Weight: number;
    Emitted: boolean;
    BirthDate: Date;                        // property exists only on GUI
    Gender: Gender;                         // property exists only on GUI
    CycleItems: CycleItem[];

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
                Emitted: false,
                CycleItems: []
            };
        } else {
            cycle = <ICycle>cycleOrDiagnosticId;
            cycle.BirthDate = birthDate;
            cycle.Gender = gender;
        }

        if (!cycle.Height) {
            cycle.Height = height;
        }
        if (!cycle.Weight) {
            cycle.Weight = weight;
        }

        for (const prop in cycle) {
            if (/^[A-Z]/.test(prop)) {
                this[prop] = cycle[prop];
            }
        }

        if (cycle.CycleItems) {
            this.CycleItems = cycle.CycleItems.map(ci => new CycleItem(ci, this));
        }

        this.StartDate = new Date(cycle.StartDate.toString());
    }

    get isSerumCreatNeeded(): boolean {
        return this.Treatment && this.Treatment.IsSerumCreatNeeded;
    }

    get bodySurfaceArea(): number {
        return Patient.bodySurfaceArea(this.Height, this.Weight);
    }

    get age(): number {
        return Patient.age(this.BirthDate, this.StartDate);
    }

    get durationInDays(): number {
        let durationInDays = 0;

        if (this.CycleItems && this.CycleItems.length) {
            const onDayArray: number[] = this.CycleItems.map(ci => ci.OnDay),
                startDay = Math.min(...onDayArray),
                endDay = Math.max(...onDayArray);

            durationInDays = endDay - startDay + 1;
        }

        return durationInDays;
    }

    get endDate(): Date {
        if (!this.StartDate) {
            return null;
        }
        const date = new Date(this.StartDate.toString());

        date.setDate(date.getDate() + this.durationInDays);

        return date;
    }

    applyTreatment(treatment: Treatment): void {
        const cycleItems = [];

        if (treatment.TreatmentItems && treatment.TreatmentItems.length) {
            treatment.TreatmentItems.forEach(ti => {
                if (ti.EndDay) {
                    for (let onDay = ti.OnDay; onDay <= ti.EndDay; onDay += ti.DayStep ? ti.DayStep : 1) {
                        const cycleItem = this.getCycleItem(ti, onDay);

                        cycleItems.push(cycleItem);
                    }
                } else {
                    const cycleItem = this.getCycleItem(ti);
                    cycleItems.push(cycleItem);
                }
            });
        }

        this.CycleItems = cycleItems;
        this.sortCycleItems();
    }

    sortCycleItems(): void {
        const sortedCycleItems = this.CycleItems.sort((a, b) => {
            const onDayDifference = a.OnDay - b.OnDay;
            if (onDayDifference) {
                return onDayDifference;
            }
            const medicamentNameDifference = a.Medicament && b.Medicament ? (a.Medicament.Name > b.Medicament.Name ? 1 : -1) : 0;

            return medicamentNameDifference;
        });

        this.CycleItems = sortedCycleItems;
    }

    private getCycleItem(ti: TreatmentItem, onDay?: number): CycleItem {
        const cycleItem = new CycleItem(<ICycleItem>{
            CycleId: this.Id,
            Cycle: <any>this,
            TreatmentItemId: ti.Id,
            TreatmentItem: new TreatmentItem(ti),
            MedicamentId: ti.MedicamentId,
            Medicament: new Medicament(ti.Medicament),
            OnDay: onDay ? onDay : ti.OnDay,
            QuantityCalculated: 0,
            QuantityApplied: 0,
            Description: ti.Description
        });

        cycleItem.setCalculatedQuantity();

        return cycleItem;
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
    Emitted: boolean;
    CycleItems: ICycleItem[];
}
