import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Customer} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserBS = new BehaviorSubject(null);
  currentUser$ = this.currentUserBS.asObservable();

  constructor() {
  }

  setUser(user: Customer) {
    this.currentUserBS.next(user);
  }

  getUser(): Customer {
    return this.currentUserBS.getValue();
  }
}
