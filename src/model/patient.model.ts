import { CommonEntity, IValidity } from '../common/common.entity';

export class Patient extends CommonEntity<Patient> implements IPatient {
    Id?: number;
    CNP: string;
    FirstName: string;
    LastName: string;
    BirthDate: Date;
    Gender: Gender;
    Height: number;
    Weight: number;
    private cnpValidator: CNPValidator = new CNPValidator();

    constructor(
        patient?: IPatient
    ) {
        super(Patient.validityMap);
        if (!patient) {
            patient = <IPatient>{
                CNP: '',
                FirstName: '',
                LastName: "",
                BirthDate: new Date(),
                Gender: Gender.Male,
                Height: 170,
                Weight: 60
            };
        }

        for (var prop in patient) {
            this[prop] = patient[prop];
        }

        this.BirthDate = new Date(patient.BirthDate.toString());
    }

    static validityMap = new Map<string, IValidity<Patient>[]>([
        ['CNP',
            [
                {
                    rule: (entity: Patient) => !!entity.CNP,
                    message: (entity: Patient) => `CNP-ul pacientului trebuie sa fie specificat.`
                },
                {
                    rule: (entity: Patient) => !entity.CNP || entity.CNP.length == 13,
                    message: (entity: Patient) => `CNP-ul pacientului trebuie sa fie exact 13 caractere.`
                },
                {
                    rule: (entity: Patient) => {
                        return !entity.CNP || entity.CNP.length != 13 || entity.cnpValidator.validateCNP(entity.CNP);
                    },
                    message: (entity: Patient) => `CNP-ul pacientului este intr-un format incorect.`
                }
            ]
        ],
        ['FirstName',
            [
                {
                    rule: (entity: Patient) => !!entity.FirstName,
                    message: (entity: Patient) => `Prenumele patientului trebuie sa fie specificat.`
                },
                {
                    rule: (entity: Patient) => !entity.FirstName || entity.FirstName.length >= 2,
                    message: (entity: Patient) => `Prenumele patientului trebuie sa contina cel putin 2 caractere.`
                }
            ]

        ],
        ['LastName',
            [
                {
                    rule: (entity: Patient) => !!entity.LastName,
                    message: (entity: Patient) => `Numele patientului trebuie sa fie specificat.`
                },
                {
                    rule: (entity: Patient) => !entity.LastName || entity.LastName.length >= 2,
                    message: (entity: Patient) => `Numele patientului trebuie sa contina cel putin 2 caractere.`
                }
            ]

        ],
        ['Height',
            [
                {
                    rule: (entity: Patient) => !!entity.Height,
                    message: (entity: Patient) => `Inaltimea patientului trebuie sa fie specificata.`
                },
                {
                    rule: (entity: Patient) => !entity.Height || (entity.Height >= 60 && entity.Height <= 260),
                    message: (entity: Patient) => `Inaltimea patientului trebuie sa fie intre 60 si 260 cm.`
                }
            ]

        ],
        ['Weight',
            [
                {
                    rule: (entity: Patient) => !!entity.Weight,
                    message: (entity: Patient) => `Greutatea patientului trebuie sa fie specificata.`
                },
                {
                    rule: (entity: Patient) => !entity.Weight || (entity.Weight >= 20 && entity.Weight <= 500),
                    message: (entity: Patient) => `Greutatea patientului trebuie sa fie intre 20 si 500 cm.`
                }
            ]

        ]
    ]);

    get Age(): number {
        return Patient.age(this.BirthDate);
    }

    get BodySurfaceArea(): number {
        return Patient.bodySurfaceArea(this.Height, this.Weight);
    }

    get GenderDisplay(): string {
        return this.Gender == Gender.Male ? 'M' : 'F';
    }

    extractCNP(): void {
        if (this.cnpValidator.isValid) {
            this.BirthDate = this.cnpValidator.birthDate;
            this.Gender = this.cnpValidator.gender;
        }
    }

    static bodySurfaceArea(height: number, weight: number): number {
        let area = 0;

        if (height && weight) {
            area = 0.20247 * Math.pow(height / 100, 0.725) * Math.pow(weight, 0.425);
        }

        return area;
    }

    static age(birthDate: Date, date?: Date): number {
        let age = 0;

        if (typeof birthDate == 'string') birthDate = new Date(birthDate);
        if (typeof date == 'string') date = new Date(date);

        let now = date ? date : new Date(),
            months = now.getMonth() - birthDate.getMonth();

        age = now.getFullYear() - birthDate.getFullYear();

        if (months < 0 || (months === 0 && now.getDate() < birthDate.getDate())) {
            age--;
        }


        return age;
    }
}

export interface IPatient {
    CNP: string;
    FirstName: string,
    LastName: string,
    BirthDate: Date,
    Gender: Gender,
    Height: number,
    Weight: number    
}

export enum Gender {
    Male, Female
}

class CNPValidator {
    birthDate: Date;
    gender: Gender;
    isValid: boolean;

    constructor(

    ) {

    }

    validateCNP(cnp: string): boolean {
        if (!cnp) return false;

        let i = 0,
            year = 0,
            hashResult = 0,
            cnpArray = [];

        if (cnp.length !== 13) { return false; }

        for (i = 0; i < 13; i++) {
            cnpArray[i] = parseInt(cnp.charAt(i), 10);
            if (isNaN(cnpArray[i])) { return false; }
            if (i < 12) { hashResult = hashResult + (cnpArray[i] * CNPValidator.HashTable[i]); }
        }

        hashResult = hashResult % 11;

        if (hashResult === 10) { hashResult = 1; }

        year = (cnpArray[1] * 10) + cnpArray[2];

        switch (cnpArray[0]) {
            case 1: case 2: { year += 1900; } break;
            case 3: case 4: { year += 1800; } break;
            case 5: case 6: { year += 2000; } break;
            case 7: case 8: case 9: { year += 2000; if (year > new Date().getFullYear()) { year -= 100; } } break;
            default: { return false; }
        }

        if (year < 1800 || year > 2099) { return false; }
        this.isValid = cnpArray[12] === hashResult;

        if (this.isValid) {
            let monthStr = cnp.substr(3, 2),
                dayStr = cnp.substr(5, 2),
                month = Number(monthStr) - 1,
                day = Number(dayStr);


            this.birthDate = new Date(year, month, day);
            this.gender = CNPValidator.MalePrefixes.includes(cnpArray[0]) ? Gender.Male : Gender.Female;
        }

        return this.isValid;
    }

    static HashTable = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
    static MalePrefixes = [1, 3, 5, 7];
}