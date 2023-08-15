import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { FormAnswerComponent } from './form-answer.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FormAnswerComponent', () => {
  let component: FormAnswerComponent;
  let fixture: ComponentFixture<FormAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormAnswerComponent],
      imports: [ApolloTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
