/*
 * Public API Surface of @oort-front/shared/widgets

 * Any new component/service/module/model/guard needed for the web-components project should be add in this index file
 * In order to keep minimum package weight with only the required files for it
 */

// === SERVICES ===
export * from '../lib/services/auth/auth.service';
export * from '../lib/services/form/form.service';
//export * from '../lib/services/layout/layout.service';
export * from '../lib/services/kendo-translation/kendo-translation.service';
export * from '../lib/services/auth-interceptor/auth-interceptor.service';

// === GUARDS ===
export * from '../lib/guards/permission.guard';

// === MODELS ===
export * from '../lib/models/form.model';

// === COMPONENTS ===

export * from '../lib/components/form/public-api';
