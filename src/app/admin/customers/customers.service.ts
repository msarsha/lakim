import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Customer} from '../../models';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private costumers$ = this.db.collection<Customer>('user-profiles').valueChanges();

  approved$ = this.costumers$.pipe(
      map((costumers) => costumers.filter(costumer => costumer.approved))
  );

  waitingApproval$ = this.costumers$.pipe(
      map((costumers) => costumers.filter(costumer => !costumer.approved))
  );

  constructor(private db: AngularFirestore) {
  }
}
