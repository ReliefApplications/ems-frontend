import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataStudioComponent } from './data-studio.component';

describe('DataStudioComponent', () => {
  let component: DataStudioComponent;
  let fixture: ComponentFixture<DataStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataStudioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
