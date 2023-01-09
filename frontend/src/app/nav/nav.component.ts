import { User } from './../_model/User';
import { AccountService } from './../_services/account.service';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  model: any = {};


  currentUser$:Observable<null | User>=of(null);

  constructor(public account: AccountService) {}

  ngOnInit(){
   // this.getCurrentUser();
   // this.currentUser$=this.account.currentUser$;
  }

  // getCurrentUser(){
  //   this.account.currentUser$.subscribe({
  //      next:user=>this.loggedIn=!!user,
  //      error:error=>console.log(error)
  // })
  // }


  login() {
    this.account.login(this.model).subscribe({
      next: (response) => {
        console.log(response);

      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  logout(){
    this.account.logout();

  }
}
