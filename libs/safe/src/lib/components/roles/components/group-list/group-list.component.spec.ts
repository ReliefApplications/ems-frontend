import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeGroupListComponent } from './group-list.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule, DialogModule, IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../../../skeleton/skeleton-table/skeleton-table.module';

describe('SafeGroupListComponent', () => {
  let component: SafeGroupListComponent;
  let fixture: ComponentFixture<SafeGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      declarations: [SafeGroupListComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        DialogModule,
        IconModule,
        ButtonModule,
        SafeSkeletonTableModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
