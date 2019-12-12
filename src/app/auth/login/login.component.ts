import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
  }

  login() {
    if (this.form.valid) {
      this.auth.login(this.form.value)
          .subscribe(() => {
            this.router.navigate(['client']);
          });
    }
  }
}
