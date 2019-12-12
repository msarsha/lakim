import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form = this.fb.group({
    email: ['', Validators.required],
    name: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private auth: AuthenticationService, private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  signup() {
    if (this.form.valid) {
      this.auth
          .signup(this.form.value)
          .subscribe(console.log);
    }
  }
}
