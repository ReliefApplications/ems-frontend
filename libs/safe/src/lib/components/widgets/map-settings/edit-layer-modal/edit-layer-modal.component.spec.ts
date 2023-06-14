import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLayerModalComponent } from './edit-layer-modal.component';

describe('EditLayerModalComponent', () => {
  let component: EditLayerModalComponent;
  let fixture: ComponentFixture<EditLayerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLayerModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditLayerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
