import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private account:AccountService,private toastr:ToastrService) { };


  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  ngOnInit() {

  }

  register() {
    this.account.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: err => this.toastr.error(err.error)
    })
  }

  cancel() {
    this.cancelRegister.emit(false);

  }
}
