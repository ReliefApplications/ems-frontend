import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeEditLayerModalComponent } from './edit-layer-modal.component';

describe('SafeEditLayerModalComponent', () => {
  let component: SafeEditLayerModalComponent;
  let fixture: ComponentFixture<SafeEditLayerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeEditLayerModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditLayerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
