import {Component} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {FormBuilder, Validators} from '@angular/forms';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class ResetComponent {
  codeSent = false;
  form = this.fb.group({
    email: ['', {validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]}],
  });

  constructor(private authServe: AuthenticationService,
              private fb: FormBuilder,
              private alertController: AlertController,
              private router: Router) {
  }

  reset() {
    this.codeSent = true;
    this.authServe.resetPassword(this.form.value.email)
        .subscribe(async () => {
          const alert = await this.alertController.create({
            header: 'איפוס סיסמא',
            message: 'איפוס סיסמא נשלח למייל',
            buttons: ['טוב']
          });
          await alert.present();
          this.router.navigateByUrl('auth/login');
        }, async (err) => {
          if (err.code === 'auth/user-not-found') {
            const alert = await this.alertController.create({
              header: 'איפוס סיסמא נכשל',
              message: 'אימייל לא קיים במערכת',
              buttons: ['טוב']
            });
            await alert.present();
          } else {
            const alert = await this.alertController.create({
              header: 'איפוס סיסמא נכשל',
              message: 'איפוס הסיסמא נכשל',
              buttons: ['טוב']
            });
            await alert.present();

          }
        });
  }
}
