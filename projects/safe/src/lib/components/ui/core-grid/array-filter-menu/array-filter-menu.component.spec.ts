import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeArrayFilterMenuComponent } from './array-filter-menu.component';

describe('SafeArrayFilterMenuComponent', () => {
  let component: SafeArrayFilterMenuComponent;
  let fixture: ComponentFixture<SafeArrayFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeArrayFilterMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeArrayFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
