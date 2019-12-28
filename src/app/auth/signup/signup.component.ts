import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ToastTypes} from '../../shared/services/toast-types';
import {ToastService} from '../../shared/services/toast.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form = this.fb.group({
    email: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private auth: AuthenticationService,
              private fb: FormBuilder,
              private toastService: ToastService,
              private router: Router) {
  }

  ngOnInit() {
  }

  signup() {
    if (this.form.valid) {
      this.auth
          .signup(this.form.value)
          .subscribe(async () => {
            await this.toastService.open(ToastTypes.NOT_APPROVED);
            this.router.navigate(['auth', 'login']);
          });
    }
  }
}
