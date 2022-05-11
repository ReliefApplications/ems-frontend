import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SafeTileDataComponent } from './tile-data.component';

describe('SafeTileDataComponent', () => {
  let component: SafeTileDataComponent;
  let fixture: ComponentFixture<SafeTileDataComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SafeTileDataComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
