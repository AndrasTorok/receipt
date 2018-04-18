import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailDisplayComponent } from './patient-detail-display.component';

describe('PatientDetailDisplayComponent', () => {
  let component: PatientDetailDisplayComponent;
  let fixture: ComponentFixture<PatientDetailDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDetailDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
