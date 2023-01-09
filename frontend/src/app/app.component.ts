import { AccountService } from './_services/account.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from './_model/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  users:any;
  constructor(private http:HttpClient,private account:AccountService) {
  }

  ngOnInit(){
    //this.getUsers();
    this.setCurrentUser();
  }




  setCurrentUser(){
    const userString=localStorage.getItem('user');
    if(!userString) return;
    const user:User=JSON.parse(userString);
    this.account.setCurrentUser(user);
  }
}
