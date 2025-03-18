import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { SnackbarService } from '../services/snackbar.service';
import { inject } from '@angular/core';

export const artistGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const snack = inject(SnackbarService);

  if(accountService.isArtist() || accountService.isAdmin()) {
    return true;
  } else {
    snack.error('Nope');
    router.navigateByUrl('/showroom');
    return false;
  }
};
