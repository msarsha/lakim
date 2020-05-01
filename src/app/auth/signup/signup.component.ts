import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ToastTypes} from '../../shared/services/toast-types';
import {ToastService} from '../../shared/services/toast.service';
import {Router} from '@angular/router';
import {FCMProvider} from '../../shared/services/fcm.service';
import {finalize, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  loading = false;
  form = this.fb.group({
    email: ['', {validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]}],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    password: ['', {validators: [Validators.required, Validators.minLength(6)]}]
  });

  constructor(private auth: AuthenticationService,
              private fb: FormBuilder,
              private toastService: ToastService,
              private router: Router,
              private fcm: FCMProvider) {
  }

  ngOnInit() {
  }

  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  get emailControl(): FormControl {
    return this.getControl('email');
  }

  get passwordControl(): FormControl {
    return this.getControl('password');
  }

  signup() {
    if (this.form.valid) {
      this.loading = true;
      this.fcm.getToken()
          .pipe(
              switchMap((token) => this.auth
                  .signup({...this.form.value, token})),
              finalize(() => {
                this.loading = false;
              })
          )
          .subscribe(async () => {
            await this.toastService.open(ToastTypes.NOT_APPROVED);
            await this.router.navigate(['auth', 'login']);
          });
    }
  }
}
