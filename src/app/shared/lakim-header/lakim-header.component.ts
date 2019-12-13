import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../../auth/services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-lakim-header',
  templateUrl: './lakim-header.component.html',
  styleUrls: ['./lakim-header.component.scss'],
})
export class LakimHeaderComponent implements OnInit {

  @Input() title;

  constructor(private auth: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['auth/login']);
    });
  }
}
