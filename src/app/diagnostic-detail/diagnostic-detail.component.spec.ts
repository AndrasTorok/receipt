import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticDetailComponent } from './diagnostic-detail.component';

describe('DiagnosticDetailComponent', () => {
  let component: DiagnosticDetailComponent;
  let fixture: ComponentFixture<DiagnosticDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosticDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
