import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {combineLatest, Observable} from 'rxjs';
import {Appointment, Swap} from '../../models';
import {fromPromise} from 'rxjs/internal-compatibility';
import {UserService} from './user.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SwapService {
  private swapsCollection = this.db.collection('swaps');

  swapsForUser$: Observable<Swap[]> = combineLatest([
    this.swapsCollection.snapshotChanges(),
    this.userService.currentUser$
  ]).pipe(
      map(([swaps, user]) => {
        if (!user || !user.swaps) {
          return [];
        }

        const uid = user.id;

        return swaps.filter((swapSnapshot) => {
          const swap = swapSnapshot.payload.doc.data() as Swap;
          return swap.appointment.uid === uid || swap.swapWith.uid === uid;
        }).map(snapshot => {
          const data = snapshot.payload.doc.data();
          const id = snapshot.payload.doc.id;

          return {...data, id} as Swap;
        });
      })
  );

  incomingRequestsForUser$ = this.buildSwapsObservable('swapWith',
      (swap: any) => !swap.isRejected && !swap.approved);

  sentRequestsForUser$ = this.buildSwapsObservable('appointment',
      () => true);

  constructor(private db: AngularFirestore,
              private userService: UserService) {
    this.swapsForUser$.subscribe();
  }

  createSwap(appointment: Appointment, swapWith: Appointment): Observable<any> {
    return fromPromise(
        this.swapsCollection.add({
          appointment,
          swapWith,
          createDate: new Date().getTime()
        })
    );
  }

  rejectRequest(swap: Swap): Observable<Swap> {
    return this.setSwapStatus(swap.id, false);
  }

  approveRequest(swap: Swap) {
    return this.setSwapStatus(swap.id, true);
  }

  cancelRequest(swap: Swap) {
    return fromPromise(this.swapsCollection.doc(swap.id).delete());
  }

  private setSwapStatus(swapId: string, approved: boolean): Observable<any> {
    return fromPromise(this.swapsCollection.doc(swapId)
        .update({approved, isRejected: !approved}));
  }

  private buildSwapsObservable(property: string, condition: (swap: Swap) => boolean): Observable<Swap[]> {
    return combineLatest([
      this.swapsForUser$,
      this.userService.currentUser$
    ]).pipe(
        map(([swaps, user]) => {
          if (!user || !user.swaps) {
            return [];
          }

          const uid = user.id;
          const filteredSwaps = swaps.filter((swap: any) => swap[property].uid === uid && condition(swap));
          return filteredSwaps.sort((s1, s2) => (s2.createDate as number) - (s1.createDate as number));
        })
    );
  }
}
