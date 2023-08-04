import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphQLSelectComponent } from './graphql-select.component';
import { GraphQLSelectModule } from './graphql-select.module';
import { TranslateMockModule } from '@hetznercloud/ngx-translate-mock';

describe('GraphQLSelectComponent', () => {
  let component: GraphQLSelectComponent;
  let fixture: ComponentFixture<GraphQLSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphQLSelectComponent],
      imports: [GraphQLSelectModule, TranslateMockModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphQLSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
