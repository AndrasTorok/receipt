import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Patient, IPatient, Gender } from './patient.model';

describe('Patient', () => {
    let patient: Patient;

    beforeEach(() => {
        patient = patient = new Patient(<IPatient>{
            CNP: '2721228111111',
            FirstName: 'Anda',
            LastName: 'Petre',
            Gender: Gender.Male,
            BirthDate: new Date(),
            Weight: 55,
            Height: 175
        });
    });

    it('Patient.extractCNP should extract Gender and BirthDate correctly', () => {
        patient.extractCNP();

        expect(patient.Gender).toEqual(Gender.Female);
        expect(patient.BirthDate).toEqual(new Date(1972, 12, 28));
    });
});
