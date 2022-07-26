import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeMappingModalComponent } from './mapping-modal.component';

describe('SafeMappingModalComponent', () => {
  let component: SafeMappingModalComponent;
  let fixture: ComponentFixture<SafeMappingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeMappingModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeMappingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
