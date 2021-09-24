import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SafeTileDisplayComponent } from './tile-display.component';

describe('SafeTileDisplayComponent', () => {
  let component: SafeTileDisplayComponent;
  let fixture: ComponentFixture<SafeTileDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeTileDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTileDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
