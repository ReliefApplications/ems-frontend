import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule } from '@angular/cdk/dialog';
import { ResourcesComponent } from './resources.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { ButtonModule, PaginatorModule, IconModule } from '@oort-front/ui';
import { SkeletonTableModule } from '@oort-front/shared';
import { FilterComponent } from './filter/filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ResourcesComponent', () => {
  let component: ResourcesComponent;
  let fixture: ComponentFixture<ResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourcesComponent, FilterComponent],
      imports: [
        DialogModule,
        ApolloTestingModule,
        ButtonModule,
        PaginatorModule,
        SkeletonTableModule,
        IconModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
