import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Customer} from '../../models';
import {map} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private customersCollection = this.db.collection<Customer>('user-profiles');
  private costumers$ = this.customersCollection.valueChanges();

  approved$ = this.costumers$.pipe(
      map((costumers) => costumers.filter(costumer => costumer.approved))
  );

  waitingApproval$ = this.costumers$.pipe(
      map((costumers) => costumers.filter(costumer => !costumer.approved))
  );

  constructor(private db: AngularFirestore) {
  }

  approve(id: string, approved: boolean): Observable<any> {
    return fromPromise(this.customersCollection.doc(id).update({approved}));
  }
}
