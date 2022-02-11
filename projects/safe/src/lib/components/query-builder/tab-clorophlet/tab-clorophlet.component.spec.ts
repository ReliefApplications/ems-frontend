import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTabClorophletComponent } from './tab-clorophlet.component';

describe('SafeTabClorophletComponent', () => {
  let component: SafeTabClorophletComponent;
  let fixture: ComponentFixture<SafeTabClorophletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTabClorophletComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabClorophletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
