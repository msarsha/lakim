import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {forkJoin, Observable} from 'rxjs';
import {Appointment} from '../../models';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class SwapService {
  constructor(private db: AngularFirestore) {
  }

  createSwap(appointment: Appointment, swapWith: Appointment): Observable<any> {
    return forkJoin([
      this.createSwapRequest(appointment, swapWith, appointment.uid),
      this.createSwapRequest(appointment, swapWith, swapWith.uid)
    ]);
  }

  private createSwapRequest(appointment: Appointment, swapWith: Appointment, uid: string): Observable<any> {
    return fromPromise(this.db
        .doc(`swaps/${uid}`)
        .set({appointment, swapWith}));
  }
}
