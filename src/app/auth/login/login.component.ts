import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {Customer} from '../../models';
import {ToastController} from '@ionic/angular';

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

  constructor(private fb: FormBuilder,
              private auth: AuthenticationService,
              private router: Router,
              public toastController: ToastController) {
  }

  ngOnInit() {
  }

  login() {
    if (this.form.valid) {
      this.auth.login(this.form.value)
          .subscribe(async (user: Customer) => {
            if (user.approved) {
              this.router.navigate(['client']);
            } else {
              const toast = await this.toastController.create({
                message: 'אינך מאושר - פנה לבעל העסק',
                duration: 3000,
                buttons: [
                  {
                    role: 'cancel',
                    text: 'טוב'
                  }
                ]

              });
              toast.present();
            }
          });
    }
  }
}
