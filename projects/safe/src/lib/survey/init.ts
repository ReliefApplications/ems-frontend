import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { DomService } from '../services/dom/dom.service';
import { SafeAuthService } from '../services/auth/auth.service';
import { SafeReferenceDataService } from '../services/reference-data/reference-data.service';

import addCustomFunctions from '../utils/custom-functions';

import * as ResourceComponent from './components/resource';
import * as ResourcesComponent from './components/resources';
import * as OwnerComponent from './components/owner';
import * as UsersComponent from './components/users';

import * as TextWidget from './widgets/text-widget';
import * as CommentWidget from './widgets/comment-widget';

import * as OtherProperties from './global-properties/others';
import * as ReferenceDataProperties from './global-properties/reference-data';
import * as TooltipProperty from './global-properties/tooltip';

import * as DateEditor from './editors/date.surveyjseditor';
import * as ResourceDropdown from './editors/resource.surveyjseditor';
import * as ResourceFields from './editors/resourceFields.surveyjseditor';
import * as Description from './editors/description.surveyjseditor';

import { initLocalization } from './localization';

/**
 * Executes all init methods of custom SurveyJS.
 *
 * @param Survey surveyJs or surveyJsCreator library
 * @param domService Shared DOM service, used to inject components on the go
 * @param dialog dialog service
 * @param apollo apollo service
 * @param formBuilder form builder service
 * @param authService custom auth service
 * @param environment injected environment
 * @param referenceDataService Reference data service
 */
export const initCustomSurvey = (
  Survey: any,
  domService: DomService,
  dialog: MatDialog,
  apollo: Apollo,
  formBuilder: FormBuilder,
  authService: SafeAuthService,
  environment: any,
  referenceDataService: SafeReferenceDataService
): void => {
  // load editors
  DateEditor.init(domService);
  ResourceDropdown.init(domService);
  ResourceFields.init(apollo, formBuilder, dialog, environment);
  Description.init();

  // load widgets (aka custom questions)
  CommentWidget.init(Survey);
  TextWidget.init(Survey, domService);

  // load components (same as widgets, but with less configuration options)
  ResourceComponent.init(Survey, apollo, dialog);
  ResourcesComponent.init(Survey, domService, apollo, dialog);
  OwnerComponent.init(Survey, domService, apollo);
  UsersComponent.init(Survey, domService, apollo);

  // load global properties
  ReferenceDataProperties.init(Survey, domService, referenceDataService);
  TooltipProperty.init(Survey);
  OtherProperties.init(Survey, environment);

  // set localization
  initLocalization(Survey);

  // load internal functions
  addCustomFunctions(Survey, authService, apollo);
};
