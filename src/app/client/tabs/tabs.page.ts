import {Component} from '@angular/core';
import {SwapService} from '../../shared/services/swap.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  incomingRequests$ = this.swapsService.incomingRequestsForUser$
      .pipe(map(swaps => swaps.length));

  constructor(private swapsService: SwapService) {
  }
}
