import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptionComponent } from './select-option.component';

describe('SelectOptionComponent', () => {
  let component: SelectOptionComponent;
  let fixture: ComponentFixture<SelectOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectOptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
