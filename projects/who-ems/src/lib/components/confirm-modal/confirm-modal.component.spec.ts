import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoConfirmModalComponent } from './confirm-modal.component';

describe('WhoConfirmModalComponent', () => {
  let component: WhoConfirmModalComponent;
  let fixture: ComponentFixture<WhoConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoConfirmModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
