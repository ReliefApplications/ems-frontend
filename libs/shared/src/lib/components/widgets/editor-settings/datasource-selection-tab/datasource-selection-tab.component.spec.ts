import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceSelectionTabComponent } from './datasource-selection-tab.component';

describe('DatasourceSelectionTabComponent', () => {
  let component: DatasourceSelectionTabComponent;
  let fixture: ComponentFixture<DatasourceSelectionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatasourceSelectionTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasourceSelectionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
