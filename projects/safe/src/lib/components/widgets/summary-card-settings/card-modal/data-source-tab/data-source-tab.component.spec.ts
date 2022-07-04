import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSourceTabComponent } from './data-source-tab.component';

describe('DataSourceTabComponent', () => {
  let component: DataSourceTabComponent;
  let fixture: ComponentFixture<DataSourceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSourceTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSourceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
