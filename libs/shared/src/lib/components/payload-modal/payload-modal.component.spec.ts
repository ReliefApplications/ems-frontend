import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayloadModalComponent } from './payload-modal.component';

describe('PayloadModalComponent', () => {
  let component: PayloadModalComponent;
  let fixture: ComponentFixture<PayloadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayloadModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PayloadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
