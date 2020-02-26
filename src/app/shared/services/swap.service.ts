import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Appointment} from '../../models';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class SwapService {
  private swapsCollection = this.db.collection('swaps');

  constructor(private db: AngularFirestore) {
  }

  createSwap(appointment: Appointment, swapWith: Appointment): Observable<any> {
    return fromPromise(
        this.swapsCollection.add({
          appointment,
          swapWith
        })
    );
  }
}
