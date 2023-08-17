import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeUnsubscribeComponent } from './unsubscribe.component';

describe('SafeUnsubscribeComponent', () => {
  let component: SafeUnsubscribeComponent;
  let fixture: ComponentFixture<SafeUnsubscribeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeUnsubscribeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeUnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
