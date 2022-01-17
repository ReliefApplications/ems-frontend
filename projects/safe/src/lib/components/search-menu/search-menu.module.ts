import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SafeSearchMenuComponent } from "./search-menu.component";
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms'; 

@NgModule({
    declarations: [SafeSearchMenuComponent],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule
    ],
    exports: [SafeSearchMenuComponent],
  })
  export class SafeSearchMenuModule {}