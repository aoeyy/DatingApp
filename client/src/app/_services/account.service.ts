import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

//services are injectable
//injectable means it can be injected into other components or services in our application
@Injectable({
  //'root' because an angular service is a singleton
  //when we inject it into a component and it is initialized, it will stay initialized until it is disposed of
  //at that point, our service is destroyed
  //this service will stay initialized for however long the session is open 
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  //a replaysubject is like a buffer object
  //it stores the values inside and any time a subscriber subscribes to the observable, it omits the last value inside it or however many values inside it that we want to omit
  //ReplaySubject<the type>(how many previous values we want it to store)
  private currentUserSource = new ReplaySubject<User>(1);

  //$ at the end because it's an observable
  currentUser$ = this.currentUserSource.asObservable();

  //inject the http client into our account service
  constructor(private http: HttpClient) { }

  //when we login, we are subscribing to our nav component so this runs
  //login is going to receive our credentials from the login form from the nav bar
  login(model: any)
  {
    //model contains the username and password that we send up to the server
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      //rxjs operator
      map((response: User) => {
          const user = response;

          //if we have a user, then we populate the user object we get back in local storage in the browser
          if (user){
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource.next(user);
          }
      })
    )
  }

  register(model: any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    )
  }

  //helper method
  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
