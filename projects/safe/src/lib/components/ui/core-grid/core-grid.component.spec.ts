import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeCoreGridComponent } from './core-grid.component';

describe('SafeCoreGridComponent', () => {
  let component: SafeCoreGridComponent;
  let fixture: ComponentFixture<SafeCoreGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeCoreGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeCoreGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
