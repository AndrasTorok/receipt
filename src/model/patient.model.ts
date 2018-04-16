import { CommonEntity, IValidity } from '../common/common.entity';
import { Calculation } from '../common/helpers';

export class Patient extends CommonEntity<Patient> implements IPatient {
    Id?: number;
    CNP: string;
    FirstName: string;
    LastName: string;
    BirthDate: Date;
    Gender: Gender;
    Height: number;
    Weight: number;

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

    static cnpPattern = new RegExp('^[1-9]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)(00[1-9]|0[1-9]\d|[1-9]\d\d)\d$');

    static validityMap = new Map<string, IValidity<Patient>[]>([
        ['CNP',
            [
                {
                    rule: (entity: Patient) => !!entity.CNP,
                    message: (entity: Patient) => `CNP-ul patientului trebuie sa fie specificat.`
                },
                {
                    rule: (entity: Patient) => !entity.CNP || entity.CNP.length >= 2,
                    message: (entity: Patient) => `CNP-ul patientului trebuie sa fie minin 2 caractere.`
                },
                {
                    rule: (entity: Patient) => !entity.CNP || entity.CNP.length <= 13,
                    message: (entity: Patient) => `CNP-ul patientului trebuie sa fie maxim 13 caractere.`
                },
                {
                    rule: (entity: Patient) => {
                        if(!entity.CNP) return true;
                        let test = //Patient.cnpPattern.match(entity.CNP);
                            !entity.CNP.match(Patient.cnpPattern);
                        //!entity.CNP || !Patient.cnpPattern.test(entity.CNP)

                        return test;
                    },
                    message: (entity: Patient) => `CNP-ul patientului este intr-un format incorect.`
                }
            ]
        ],
        ['FirstName', 
            [
                {
                    rule: (entity: Patient) => !!entity.FirstName ,
                    message: (entity: Patient) => `Prenumele patientului trebuie sa fie specificat.`
                },
                {
                    rule: (entity: Patient) => !entity.FirstName || entity.FirstName.length >=2 ,
                    message: (entity: Patient) => `Prenumele patientului trebuie sa contina cel putin 2 caractere.`
                }
            ]

        ],
        ['LastName', 
            [
                {
                    rule: (entity: Patient) => !!entity.LastName ,
                    message: (entity: Patient) => `Numele patientului trebuie sa fie specificat.`
                },
                {
                    rule: (entity: Patient) => !entity.LastName || entity.LastName.length >=2 ,
                    message: (entity: Patient) => `Numele patientului trebuie sa contina cel putin 2 caractere.`
                }
            ]

        ],
        ['Height', 
            [
                {
                    rule: (entity: Patient) => !!entity.Height ,
                    message: (entity: Patient) => `Inaltimea patientului trebuie sa fie specificata.`
                },
                {
                    rule: (entity: Patient) => !entity.Height || (entity.Height>=60 && entity.Height<=260 ),
                    message: (entity: Patient) => `Inaltimea patientului trebuie sa fie intre 60 si 260 cm.`
                }                
            ]

        ],
        ['Weight', 
            [
                {
                    rule: (entity: Patient) => !!entity.Weight ,
                    message: (entity: Patient) => `Greutatea patientului trebuie sa fie specificata.`
                } ,
                {
                    rule: (entity: Patient) => !entity.Weight || (entity.Weight>=20 && entity.Weight<=500 ),
                    message: (entity: Patient) => `Greutatea patientului trebuie sa fie intre 20 si 500 cm.`
                }              
            ]

        ]
    ]);

    get Age(): number {
        return Calculation.age(this.BirthDate);
    }

    get BodySurfaceArea(): number {
        return Calculation.bodySurfaceArea(this.Height, this.Weight);
    }

    get GenderDisplay(): string {
        return this.Gender == Gender.Male ? 'M' : 'F';
    }

    extractCNP(): void {
        let cnp = this.CNP,
            genderStr = cnp.substr(0, 1),
            yearStr = cnp.substr(1, 2),
            monthStr = cnp.substr(3, 2),
            dayStr = cnp.substr(5, 2),
            year = Number(yearStr),
            month = Number(monthStr) - 1,
            day = Number(dayStr);

        year += [Male20thCentury, Female20thCentury].includes(genderStr) ? 1900 : 2000;
        this.BirthDate = new Date(year, month, day);
        this.Gender = [Male20thCentury, Male21stCentury].includes(genderStr) ? Gender.Male : Gender.Female;
    }
}

const Male20thCentury = '1', Female20thCentury = '2', Male21stCentury = '5', Female21stCentury = '6';

export interface IPatient {
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