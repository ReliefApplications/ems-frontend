import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphqlVariablesMappingComponent } from './graphql-variables-mapping.component';

describe('GraphqlVariablesMappingComponent', () => {
  let component: GraphqlVariablesMappingComponent;
  let fixture: ComponentFixture<GraphqlVariablesMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphqlVariablesMappingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphqlVariablesMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
