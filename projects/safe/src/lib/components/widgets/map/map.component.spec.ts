import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeMapComponent } from './map.component';

describe('SafeMapComponent', () => {
  let component: SafeMapComponent;
  let fixture: ComponentFixture<SafeMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
