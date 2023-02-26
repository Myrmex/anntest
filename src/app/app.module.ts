import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SdImgAnnotatorModule } from 'projects/sd-img-annotator/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SdImgAnnotatorModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
