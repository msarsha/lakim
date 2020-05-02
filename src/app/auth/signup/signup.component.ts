import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ToastTypes} from '../../shared/services/toast-types';
import {ToastService} from '../../shared/services/toast.service';
import {Router} from '@angular/router';
import {FCMProvider} from '../../shared/services/fcm.service';
import {finalize, switchMap} from 'rxjs/operators';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  loading = false;
  form = this.fb.group({
    email: ['', {validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]}],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    password: this.fb.control('', {validators: [Validators.required, Validators.minLength(6)]})
  });

  constructor(private auth: AuthenticationService,
              private fb: FormBuilder,
              private router: Router,
              private alertController: AlertController,
              private fcm: FCMProvider) {
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
            const alert = await this.alertController.create({
              header: 'נרשמת בהצלחה',
              message: 'נא צור קשר עם בעל העסק לצורך אישור החשבון',
              buttons: ['טוב']
            });
            await alert.present();
            await this.router.navigate(['auth', 'login']);
          }, async () => {
            const alert = await this.alertController.create({
              header: 'הרשמה נכשלה',
              message: 'נא צור קשר עם בעל העסק',
              buttons: ['טוב']
            })
            await alert.present();
          });
    }
  }

  private updateZone() {

  }
}
