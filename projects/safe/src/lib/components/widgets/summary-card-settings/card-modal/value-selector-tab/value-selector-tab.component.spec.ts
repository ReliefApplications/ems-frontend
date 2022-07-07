import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSelectorTabComponent } from './value-selector-tab.component';

describe('ValueSelectorTabComponent', () => {
  let component: ValueSelectorTabComponent;
  let fixture: ComponentFixture<ValueSelectorTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValueSelectorTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSelectorTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
