import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSelectionTabComponent } from './record-selection-tab.component';

describe('RecordSelectionTabComponent', () => {
  let component: RecordSelectionTabComponent;
  let fixture: ComponentFixture<RecordSelectionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordSelectionTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordSelectionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
