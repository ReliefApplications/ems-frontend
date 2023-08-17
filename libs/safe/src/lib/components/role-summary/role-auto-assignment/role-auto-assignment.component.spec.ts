import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleAutoAssignmentComponent } from './role-auto-assignment.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeEmptyModule } from '../../ui/empty/empty.module';

describe('RoleAutoAssignmentComponent', () => {
  let component: RoleAutoAssignmentComponent;
  let fixture: ComponentFixture<RoleAutoAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      declarations: [RoleAutoAssignmentComponent],
      imports: [
        DialogModule,
        ApolloTestingModule,
        HttpClientModule,
        SafeEmptyModule,
        ButtonModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleAutoAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
