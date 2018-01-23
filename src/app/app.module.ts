import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component'
import { DemoComponent } from './demo/demo.component'
import { CodePreviewerComponent } from './code-previewer/code-previewer.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    CodePreviewerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  exports: [CodePreviewerComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
