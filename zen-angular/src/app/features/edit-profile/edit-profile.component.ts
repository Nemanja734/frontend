import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AccountService } from '../../core/services/account.service';
import { User } from '../../shared/models/user';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { Pictures } from '../../shared/models/pictures';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GlobalCurrencyPipe } from '../../shared/pipes/global-currency.pipe';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { SnackbarService } from '../../core/services/snackbar.service';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatSelectModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    MatIcon,
    MatButtonModule,
    GlobalCurrencyPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {
  private accountService = inject(AccountService);
  private dialog = inject(MatDialog);
  private snack = inject(SnackbarService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  // Editable fields
  editingEmail = false;
  editingPhoneNumber = false;

  profileForm = this.fb.group({
    newEmail: ['', Validators.email],
    newPhoneNumber: ['', Validators.pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)]
  })

  user!: User;
  pictures: Pictures[] = [];

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo() {
    this.accountService.getUserInfo().subscribe({
      next: user => {
        this.user = user
        this.getPortfolio();
      },
      error: error => console.log(error)
    })
  }

  getPortfolio() {
    this.accountService.getPortfolio(this.user.id).subscribe(result => this.pictures = result)
  }

  deletePictureDialog(picture: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: this.translate.instant('editProfile.deletePictureTitle'),
        message: this.translate.instant('editProfile.deletePictureMessage')
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.accountService.deletePicture(picture.id).subscribe({
          next: () => window.location.reload(),
        });
      }
    });
  }

  deletePortfolioDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: this.translate.instant('editProfile.deletePortfolioTitle'),
        message: this.translate.instant('editProfile.deletePortfolioMessage')
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.accountService.deletePortfolio().subscribe(() => window.location.reload());
      }
    });
  }

  openEditDialog(type: string) {
    this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { type }
    });
  }
}