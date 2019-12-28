import {Injectable} from '@angular/core';
import {ToastConfigs, ToastTypes} from './toast-types';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) {
  }

  async open(toastType: ToastTypes): Promise<void> {
    const toast = await this.toastController.create(ToastConfigs[toastType]);
    return toast.present();
  }
}
