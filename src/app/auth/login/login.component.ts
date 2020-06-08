import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {Customer} from '../../models';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {FCMProvider} from '../../shared/services/fcm.service';
import {finalize, take} from 'rxjs/operators';
import {AlertController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {

  loading = false;
  form = this.fb.group({
    email: ['', {validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]}],
    password: ['', {validators: [Validators.required]}]
  });

  constructor(private fb: FormBuilder,
              private auth: AuthenticationService,
              private router: Router,
              private alertController: AlertController,
              private fcm: FCMProvider) {
  }

  login() {
    if (this.form.valid) {
      this.loading = true;
      this.auth.login(this.form.value)
          .pipe(
              take(1),
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
              const alert = await this.alertController.create({
                header: 'אין הרשאה',
                message: 'נא צור קשר עם בעל העסק',
                buttons: ['טוב']
              });
              await alert.present();
            }
          }, async () => {
            const alert = await this.alertController.create({
              header: 'אימייל או סיסמא לא נכונים',
              buttons: ['טוב']
            });

            await alert.present();
          });
    }
  }

  ngOnDestroy(): void {
  }
}
