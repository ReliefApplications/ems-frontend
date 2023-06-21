import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditButtonActionComponent } from './edit-button-action.component';

describe('EditButtonActionComponent', () => {
  let component: EditButtonActionComponent;
  let fixture: ComponentFixture<EditButtonActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditButtonActionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditButtonActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
