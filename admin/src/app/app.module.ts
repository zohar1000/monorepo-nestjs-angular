import { NgModule } from '@angular/core';
import { SharedAppsModule } from '@shared-apps-module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '@shared-apps/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    CoreModule,
    SharedAppsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
