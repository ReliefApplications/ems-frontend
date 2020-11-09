import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoFormModalComponent } from './form-modal.component';

describe('WhoFormModalComponent', () => {
  let component: WhoFormModalComponent;
  let fixture: ComponentFixture<WhoFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
