export class Medicament {
    Id: number;
    Name: string;
    DoseApplicationMode: DoseApplicationMode;
    Dose: number;    

    constructor(medicament?: IMedicament) {
        if(!medicament) {
            medicament = <IMedicament> {
                Id : 0,
                Name : '',
                Dose: 0
            };
        }

        for(var prop in medicament) {
            this[prop]  = medicament[prop];
        }
    }
}

export interface IMedicament {
    Id: number;
    Name: string;
    Dose: number;
}

export enum DoseApplicationMode {
    Sqm, Kg
}