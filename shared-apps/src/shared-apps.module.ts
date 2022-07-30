import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';

const declarations = [];

const modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule
];

const importModules = [...modules, BsDropdownModule.forRoot()];
const exportModules = [...modules, BsDropdownModule];

@NgModule({
  declarations,
  imports: importModules,
  exports: [...exportModules, ...declarations]
})

export class SharedAppsModule {}
