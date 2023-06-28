import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsElementComponent } from './fields-element.component';

describe('FieldsElementComponent', () => {
  let component: FieldsElementComponent;
  let fixture: ComponentFixture<FieldsElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldsElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
