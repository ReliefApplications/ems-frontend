import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingModalComponent } from './mapping-modal.component';

describe('MappingModalComponent', () => {
  let component: MappingModalComponent;
  let fixture: ComponentFixture<MappingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MappingModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
