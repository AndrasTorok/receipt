import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptPdfComponent } from './receipt-pdf.component';

describe('ReceiptPdfComponent', () => {
  let component: ReceiptPdfComponent;
  let fixture: ComponentFixture<ReceiptPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
