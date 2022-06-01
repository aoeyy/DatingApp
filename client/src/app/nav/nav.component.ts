//if you run into any problems where VS isn't automatically importing these, restart VS code
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}
  //currentUser$: Observable<User>;

  //loggedIn: boolean;

  //inject the service into this component
  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    //this.currentUser$ = this.accountService.currentUser$;
  }

  login()
  {
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/members');
      // console.log(response);
      //this.loggedIn = true;
    }, error =>{
      console.log(error);
      this.toastr.error(error.error);
    })
  }

  logout()
  {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    //this.loggedIn = false;
  }

  /*getCurrentUser(){
    this.accountService.currentUser$.subscribe(user => {
      //!! turns our object into a boolean
      //if user is null then false
      //if the user is something then true
      this.loggedIn = !!user;
    }, error => {
      console.log(error);
    })
  }*/

}
