import {Component, OnInit} from '@angular/core';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {Swap} from '../../models';
import {DatePipe} from '@angular/common';
import {ToastService} from '../../shared/services/toast.service';
import {UserService} from '../../shared/services/user.service';
import {Router} from '@angular/router';
import {SwapService} from '../../shared/services/swap.service';
import {ToastTypes} from '../../shared/services/toast-types';

@Component({
  selector: 'app-swap',
  templateUrl: './swaps.component.html',
  styleUrls: ['./swaps.component.scss'],
  providers: [DatePipe]
})
export class SwapsComponent implements OnInit {

  incomingRequests = this.swapsService.incomingRequestsForUser$;
  sentRequests = this.swapsService.sentRequestsForUser$;

  constructor(private swapsService: SwapService,
              private modalCtrl: ModalController,
              private actionSheetController: ActionSheetController,
              private datePipe: DatePipe,
              private toastService: ToastService,
              private userService: UserService,
              private router: Router
  ) {

  }

  ngOnInit() {
  }

  async openActionsForIncoming(swap: Swap) {
    if (!this.canPerformOperations(swap)) {
      return;
    }
    const actionSheet = await this.actionSheetController.create({
      header: `האם לאשר החלפת התור?`,
      buttons: [{
        text: 'דחה',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.swapsService.rejectRequest(swap)
              .subscribe(() => {
                this.toastService.open(ToastTypes.SWAP_REJECTED);
              });
        }
      }, {
        text: 'אשר',
        icon: 'swap',
        handler: () => {
          this.swapsService.approveRequest(swap);
        }
      }, {
        text: 'סגור',
        icon: 'close',
        role: 'cancel'
      }]
    });

    await actionSheet.present();
  }

  async openActionsForSent(swap: Swap) {
    if (!this.canPerformOperations(swap)) {
      return;
    }

    const actionSheet = await this.actionSheetController.create({
      header: `האם לבטל החלפת התור?`,
      buttons: [{
        text: 'בטל',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.swapsService.cancelRequest(swap)
              .subscribe(() => {
                this.toastService.open(ToastTypes.SWAP_CANCELED);
              });
        }
      }, {
        text: 'סגור',
        icon: 'close',
        role: 'cancel'
      }]
    });

    await actionSheet.present();
  }

  private canPerformOperations(swap: Swap): boolean {
    return !swap.approved && !swap.isRejected;
  }
}
