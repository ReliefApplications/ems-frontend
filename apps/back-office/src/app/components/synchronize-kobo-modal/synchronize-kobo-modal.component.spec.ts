import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SynchronizeKoboModalComponent } from './synchronize-kobo-modal.component';


describe('SynchronizeKoboModalComponent', () => {
  let component: SynchronizeKoboModalComponent;
  let fixture: ComponentFixture<SynchronizeKoboModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynchronizeKoboModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SynchronizeKoboModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
