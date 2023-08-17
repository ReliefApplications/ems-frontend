import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeEmptyComponent } from './empty.component';
import { IconModule } from '@oort-front/ui';

describe('SafeEmptyComponent', () => {
  let component: SafeEmptyComponent;
  let fixture: ComponentFixture<SafeEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeEmptyComponent],
      imports: [IconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
