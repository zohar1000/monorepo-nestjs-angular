import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedAppsModule } from '@shared-apps-module';

const declarations = [
];

const imports = [
  // angular
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,

  // app
  SharedAppsModule
];

@NgModule({
  declarations,
  imports: [
    // HttpClientModule,
    // ...modules
  ],
  exports: [
    imports,
    ...declarations
  ]
})
export class SharedModule {}
