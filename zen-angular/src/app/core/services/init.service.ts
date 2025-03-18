import { inject, Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { forkJoin, tap } from 'rxjs';
import { NotificationService } from './notification.service';
import { MessengerService } from './messenger.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private accountService = inject(AccountService);
  private notificationService = inject(NotificationService);
  private messengerService = inject(MessengerService);

  init() {
    return forkJoin({
      user: this.accountService.getUserInfo().pipe(
        tap(user => {
          if (user) {
            this.notificationService.createHubConnection();
            this.messengerService.createHubConnection();
          }
        })
      )
    })
  }
}
