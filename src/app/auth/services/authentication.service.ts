import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {

	constructor(private fbAuth: AngularFireAuth) {
	}

	async signup({ name, email, password }) {
    const user = await this.fbAuth.auth.createUserWithEmailAndPassword(email, password);
    console.log(user);
  }
}
