import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Customer} from '../../models';
import {filter, map, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {
    private customersBS = new BehaviorSubject([]);

    private customersCollection = this.db.collection<Customer>('user-profiles');
    private customers$ = this.customersBS.asObservable();

    approved$ = this.customers$.pipe(
        map((costumers) => costumers.filter(costumer => costumer.approved))
    );

    waitingApproval$ = this.customers$.pipe(
        map((costumers) => costumers.filter(costumer => !costumer.approved))
    );

    constructor(private db: AngularFirestore) {
        this.customersCollection.valueChanges()
            .pipe(
                map(customers => customers.filter(c => !c.isAdmin)),
                tap((customers) => this.customersBS.next(customers))
            ).subscribe();
    }

    approve(id: string, approved: boolean): Observable<any> {
        return fromPromise(this.customersCollection.doc(id).update({approved}));
    }
}
