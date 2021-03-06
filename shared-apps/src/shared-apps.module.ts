import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Test1Component } from './app/components/test1/test1.component';

const declarations = [
  Test1Component
];

const imports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule
];

@NgModule({
  declarations,
  imports,
  exports: [...imports, ...declarations]
})

export class SharedAppsModule {}
