import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeDateFilterMenuComponent } from './date-filter-menu.component';

describe('SafeDateFilterMenuComponent', () => {
  let component: SafeDateFilterMenuComponent;
  let fixture: ComponentFixture<SafeDateFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeDateFilterMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeDateFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
