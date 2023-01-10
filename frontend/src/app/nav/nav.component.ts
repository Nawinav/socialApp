import { User } from './../_model/User';
import { AccountService } from './../_services/account.service';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  model: any = {};


  currentUser$:Observable<null | User>=of(null);

  constructor(public account: AccountService,private route:Router,private toastr:ToastrService) {}

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
      next: _=>  this.route.navigateByUrl('/members'),
      error: (error) => {
       this.toastr.error(error.error)
      },
    });
  }

  logout(){
    this.account.logout();
    this.route.navigateByUrl('/');
  }
}
