import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSearchMenuComponent } from './search-menu.component';

describe('SafeSearchMenuComponent', () => {
  let component: SafeSearchMenuComponent;
  let fixture: ComponentFixture<SafeSearchMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSearchMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSearchMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
