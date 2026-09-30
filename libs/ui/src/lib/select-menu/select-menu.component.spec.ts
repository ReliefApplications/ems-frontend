import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMenuComponent } from './select-menu.component';

describe('SelectMenuComponent', () => {
  let component: SelectMenuComponent;
  let fixture: ComponentFixture<SelectMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('forwards its accessible label to the trigger button', () => {
    component.ariaLabelledby = 'language-label';
    fixture.detectChanges();

    expect(
      fixture.nativeElement
        .querySelector('button')
        .getAttribute('aria-labelledby')
    ).toBe('language-label');
  });
});
