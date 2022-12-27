import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  users:any;
  constructor(private http:HttpClient) {
  }

  ngOnInit(){
    this.http.get('https://localhost:5001/api/Users').subscribe({
    next:response=>this.users=response,
    error:err=>console.log(err),
    complete:()=>console.log("request completed")


  })
  }
}
