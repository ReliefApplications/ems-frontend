import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldSearchTableComponent } from './field-search-table.component';

describe('FieldSearchTableComponent', () => {
  let component: FieldSearchTableComponent;
  let fixture: ComponentFixture<FieldSearchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldSearchTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldSearchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
