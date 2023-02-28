import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAddCardComponent } from './add-card.component';

describe('AddCardComponent', () => {
  let component: SafeAddCardComponent;
  let fixture: ComponentFixture<SafeAddCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAddCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
