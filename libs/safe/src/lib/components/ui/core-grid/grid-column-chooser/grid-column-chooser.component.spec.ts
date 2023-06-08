import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeGridColumnChooserComponent } from './grid-column-chooser.component';

describe('GridColumnChooserComponent', () => {
  let component: SafeGridColumnChooserComponent;
  let fixture: ComponentFixture<SafeGridColumnChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeGridColumnChooserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeGridColumnChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
