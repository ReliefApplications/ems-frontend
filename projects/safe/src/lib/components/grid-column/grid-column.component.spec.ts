import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeGridColumnComponent } from './grid-column.component';

describe('SafeGridContentComponent', () => {
  let component: SafeGridColumnComponent;
  let fixture: ComponentFixture<SafeGridColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeGridColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
