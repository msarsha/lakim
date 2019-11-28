import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Costumer} from '../../models';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CostumersService {

  private costumers$ = this.db.collection<Costumer>('costumer-profiles').valueChanges();

  approved$ = this.costumers$.pipe(
      map((costumers) => costumers.filter(costumer => costumer.approved))
  );

  waitingApproval$ = this.costumers$.pipe(
      map((costumers) => costumers.filter(costumer => !costumer.approved))
  );

  constructor(private db: AngularFirestore) {
  }
}
