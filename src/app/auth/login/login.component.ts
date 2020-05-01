import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {Customer} from '../../models';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ToastService} from '../../shared/services/toast.service';
import {ToastTypes} from '../../shared/services/toast-types';
import {FCMProvider} from '../../shared/services/fcm.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  loading = false;
  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder,
              private auth: AuthenticationService,
              private router: Router,
              private toastService: ToastService,
              private fcm: FCMProvider) {
  }

  ngOnInit() {
  }

  login() {
    if (this.form.valid) {
      this.loading = true;
      this.auth.login(this.form.value)
          .pipe(
              untilDestroyed(this),
              finalize(() => {
                this.loading = false;
              })
          )
          .subscribe(async (user: Customer) => {
            this.fcm.addDeviceIfNeeded(user);

            if (user.isAdmin) {
              await this.router.navigate(['admin']);
            } else if (user.approved) {
              await this.router.navigate(['client']);
            } else {
              await this.toastService.open(ToastTypes.NOT_APPROVED);
            }
          });
    }
  }

  ngOnDestroy(): void {
  }
}
