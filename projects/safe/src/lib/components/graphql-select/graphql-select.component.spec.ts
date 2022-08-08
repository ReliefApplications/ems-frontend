import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeGraphQLSelectComponent } from './graphql-select.component';

describe('SafeGraphQLSelectComponent', () => {
  let component: SafeGraphQLSelectComponent;
  let fixture: ComponentFixture<SafeGraphQLSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeGraphQLSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGraphQLSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
