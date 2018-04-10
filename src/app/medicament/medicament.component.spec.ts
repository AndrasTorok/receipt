import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentComponent } from './medicament.component';

describe('MedicamentComponent', () => {
  let component: MedicamentComponent;
  let fixture: ComponentFixture<MedicamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
