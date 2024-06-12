import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DocumentUploadComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
