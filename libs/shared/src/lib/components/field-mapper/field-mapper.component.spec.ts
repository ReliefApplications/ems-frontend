import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldMapperComponent } from './field-mapper.component';

describe('FieldMapperComponent', () => {
  let component: FieldMapperComponent;
  let fixture: ComponentFixture<FieldMapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldMapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
