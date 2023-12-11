import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferenceDataPayloadModalComponent } from './reference-data-payload-modal.component';

describe('ReferenceDataPayloadModalComponent', () => {
  let component: ReferenceDataPayloadModalComponent;
  let fixture: ComponentFixture<ReferenceDataPayloadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataPayloadModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReferenceDataPayloadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
