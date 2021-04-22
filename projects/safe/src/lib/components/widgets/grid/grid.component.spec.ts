import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeGridComponent } from './grid.component';

describe('SafeGridComponent', () => {
  let component: SafeGridComponent;
  let fixture: ComponentFixture<SafeGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
