import {Component, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {NavigationError, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private router: Router,
      private db: AngularFirestore
  ) {
    this.initializeApp();
    this.subscribeRouterEvents();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit(): void {
    // Register with Apple / Google to receive push via APNS/FCM
  }

  private subscribeRouterEvents() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationError) {
        const log = Object.keys(event)
            .filter(key => event.hasOwnProperty(key) && typeof (event[key]) === 'string')
            .map(key => event[key]);
        this.db.collection('logs').add({log});
      }
    });
  }
}
