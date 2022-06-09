import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  //model: any = {};
  registerForm: UntypedFormGroup;
  maxDate: Date;
  //we get the errors back from our interceptor
  validationErrors: string[] = [];


  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: UntypedFormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();    
    this.maxDate = new Date();
    //makes sure that the users are over 18
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      //the order these are listed don't matter
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      //for multiple validators, put it in an array
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })
    //checks validity when the password is changed after the confimPassword is entered
    this.registerForm.controls.password.valueChanges.subscribe(() =>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  //method to validate that the password and confirmPassword match
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      //control?.value is the confirm password control
      //if these passwords match, then we return now and that means validation passed
      //If the passwords don't match, then we attach a validator error called is matching to the control,
      //and then this will fail our form validation 
      return control?.value === control?.parent?.controls[matchTo].value 
      ? null : {isMatching: true}
    }
  }

  register() {
    //this will contain the values from initializeForm()
    //console.log(this,this.registerForm.value)
     this.accountService.register(this.registerForm.value).subscribe(response => {
       this.router.navigateByUrl('/members');
     }, error => {
       this.validationErrors = error;
     })
    
  }

  cancel(){
    //emits false so it turns register mode and home component
    this.cancelRegister.emit(false);
  }

}
