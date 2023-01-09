import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private account:AccountService) { };


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
      error: err => console.log(err)
    })
  }

  cancel() {
    this.cancelRegister.emit(false);

  }
}
