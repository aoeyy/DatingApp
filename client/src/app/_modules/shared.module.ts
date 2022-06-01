import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(), 
    ToastrModule.forRoot({
      //makes the toast notification appear at button right
      positionClass: 'toast-button-right'
    })
  ],

  exports: [
    BsDropdownModule,
    ToastrModule
  ]
})
export class SharedModule { }
