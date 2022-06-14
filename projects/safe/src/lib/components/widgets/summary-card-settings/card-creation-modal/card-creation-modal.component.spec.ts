import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeCardCreationModalComponent } from './card-creation-modal.component';

describe('CardCreationModalComponent', () => {
  let component: SafeCardCreationModalComponent;
  let fixture: ComponentFixture<SafeCardCreationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeCardCreationModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeCardCreationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
