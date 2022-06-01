import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode = false;
  users: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    //used for choose your favorite user
    // this.getUsers();
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  //used for choose your favorite user
  // getUsers(){
  //   this.http.get('https://localhost:5001/api/users').subscribe(users => this.users = users);
  // }

  cancelRegisterMode(event: boolean){
    this.registerMode = event;
  }

}
