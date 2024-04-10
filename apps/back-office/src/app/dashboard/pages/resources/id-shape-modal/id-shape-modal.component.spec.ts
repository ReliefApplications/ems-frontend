import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdShapeModalComponent } from './id-shape-modal.component';

describe('IdShapeModalComponent', () => {
  let component: IdShapeModalComponent;
  let fixture: ComponentFixture<IdShapeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdShapeModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IdShapeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
