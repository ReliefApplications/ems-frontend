import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { PositionAttributesComponent } from './position-attributes.component';
import { ActivatedRoute } from '@angular/router';
import { SpinnerModule } from '@oort-front/ui';

describe('PositionComponent', () => {
  let component: PositionAttributesComponent;
  let fixture: ComponentFixture<PositionAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PositionAttributesComponent],
      imports: [ApolloTestingModule, SpinnerModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => {return {}}
              }
            }
          },
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
