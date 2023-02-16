import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private account:AccountService,private toastr:ToastrService, private fb: FormBuilder,private router:Router) { };


  @Output() cancelRegister = new EventEmitter();
  registerForm:FormGroup | undefined=new FormGroup({});
  maxDate:Date=new Date();
  validationErrors:string [] | undefined;


  ngOnInit() {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
  }

  register() {

    const dob=this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values={...this.registerForm.value,dateOfBirth:dob};
    //console.log(values);

    console.log(this.registerForm.value);
    this.account.register(values).subscribe({
      next: response => {
          this.router.navigateByUrl('/members')
      },
      error: err => this.validationErrors=err
    })
  }

  initializeForm(){
    this.registerForm.markAllAsTouched();
    this.registerForm=this.fb.group({
      gender: ['male'],
      knownAs:['',Validators.required],
      dateOfBirth:['',Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      username:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',Validators.required],
    },  { validator: this.passwordMatchValidator })
    
    this.registerForm.controls['password'].valueChanges.subscribe({
      next:()=>this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }


  cancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob:string){
    if(!dob)return null;

    let theDob=new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset())).toISOString().slice(0,10);
  }
}
