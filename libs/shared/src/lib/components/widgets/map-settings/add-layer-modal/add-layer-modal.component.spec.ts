import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLayerModalComponent } from './add-layer-modal.component';

describe('AddLayerModalComponent', () => {
  let component: AddLayerModalComponent;
  let fixture: ComponentFixture<AddLayerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLayerModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddLayerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
