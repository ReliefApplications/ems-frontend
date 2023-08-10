import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeNavbarComponent } from './navbar.component';

describe('SafeNavbarComponent', () => {
  let component: SafeNavbarComponent;
  let fixture: ComponentFixture<SafeNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      declarations: [SafeNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
