import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../../../core/services/account.service';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { GeocodingService } from '../../../core/services/geocoding.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatDialogModule,
    MatInput,
    MatButton,
    CommonModule,
    MatSelect,
    MatOption,
    MatSuffix,
    MatListModule,
    ReactiveFormsModule,
    MatIcon,
    TranslateModule
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent implements OnInit {

  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private geocoding = inject(GeocodingService);
  private snack = inject(SnackbarService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<EditDialogComponent>);

  form!: FormGroup;
  data = inject(MAT_DIALOG_DATA) as { type: string };
  hideNewPassword = true;
  hideOldPassword = true;
  suggestions: any[] = [];
  selectedFiles: File[] = [];
  isDragging = false;
  availableStyles: string[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    switch (this.data.type) {
      case 'password':
        this.form = this.fb.group({
          oldPassword: ['', [Validators.required, Validators.minLength(6)]],
          newPassword: ['', [Validators.required, Validators.minLength(6)]]
        });
        break;
      case 'address':
        this.form = this.fb.group({
          line1: ['', Validators.required],
          line2: [''],
          city: ['', Validators.required],
          postalCode: ['', Validators.required],
          country: ['', Validators.required],
          longitude: [''],
          latitude: ['']
        });
        break;
      case 'style':
        this.getStyles();
        this.form = this.fb.group({
          styles: []
        });
        break;
      case 'hourlyRate':
        this.form = this.fb.group({
          hourlyRate: [null, [Validators.required, Validators.min(1), Validators.max(500)]]
        });
        break;
      case 'portfolio':
        this.form = this.fb.group({
          portfolio: [null, Validators.required]
        });
        break;
      default:
        break;
    }
  }

  // Function to validate the address with Google Geocoding API
  validateAddress() {
    const { line1, line2, city, postalCode, country } = this.form.value;
    const query = `${line1}, ${line2 ? line2 + ', ' : ''}${city}, ${postalCode}, ${country}`;

    this.geocoding.validateAddress(query).pipe(
      tap((response: any) => {
        if (response.status === 'OK' && response.results.length > 0) {
          const validAddress = response.results[0].formatted_address;
          this.form.value.longitude = response.results[0].geometry.location.lng;
          this.form.value.latitude = response.results[0].geometry.location.lat;
          this.snack.success(this.translate.instant('editDialog.address.validateSuccess', { address: validAddress }));
        } else {
          this.snack.error(this.translate.instant('editDialog.address.validateError'));
        }
      }),
      switchMap((response: any) => {
        if (response && response.results && response.results.length > 0) {
          return of(response);
        } else {
          return of(null);
        }
      }),
      catchError((error) => {
        this.snack.error(this.translate.instant('editDialog.address.validateApiError'));
        return of(null);
      })
    ).subscribe((validResponse) => {
      if (validResponse) {
        this.submit();
      }
    })
  }

  getStyles() {
    this.accountService.getQualityOptions().subscribe({
      next: styles => this.availableStyles = styles,
      error: err => console.log(err)
    });
  }


  // Edit Portfolio
  openFileBrowser() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.addFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer) {
      const files = Array.from(event.dataTransfer.files) as File[];
      this.addFiles(files);
    }
  }

  addFiles(files: File[]) {
    const validFiles = files.filter(file => this.isValidFileType(file));
    if (validFiles.length !== files.length) {
      this.snack.error(this.translate.instant('editDialog.portfolio.fileTypeError'));
    }
    this.selectedFiles.push(...validFiles);
    this.form.patchValue({ portfolio: this.selectedFiles });
  }

  isValidFileType(file: File) {
    const allowedTypes = ['image/png', 'image/jpeg'];
    return allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024; // Max 5MB
  }

  getFileNames() {
    return this.selectedFiles.map(file => file.name).join(', ');
  }

  onFormSubmit() {
    if (this.form.invalid) {
      return;
    }
    switch (this.data.type) {
      case 'address':
        this.validateAddress();
        break;
      default:
        this.submit();
        break;
    }
  }


  submit() {
    switch (this.data.type) {
      case 'password':
        this.accountService.updatePassword(this.form.value).subscribe({
          next: () => {
            this.clearForm();
            this.snack.success(this.translate.instant('editDialog.password.success'));
            this.reloadPage();
          }, 
          error: (err) => {
            console.log('Error updating the password', err),
            this.snack.error(err.error[0].description || err.error);
          }
        })
        break;
      case 'address':
        this.accountService.updateAddress(this.form.value).subscribe({
          next: () => {
            this.clearForm();
            this.snack.success(this.translate.instant('editDialog.address.success'));
            this.reloadPage();
          },
          error: (err) => {
            this.snack.error('Error updating address');
            console.log(err)
          }
        });
        break;
      case 'style':
        this.accountService.updateStyle(this.form.value.styles).subscribe({
          next: () => {
            this.clearForm();
            this.snack.success(this.translate.instant('editDialog.style.success'));
            this.reloadPage();
          },
          error: (err) => {
            this.snack.error(this.translate.instant('editDialog.style.error'));
            console.log(err)
          }
        });
        break;
      case 'portfolio':
        if (this.selectedFiles) {
          const formData = new FormData();
          this.selectedFiles.forEach(file => formData.append('files', file));

          this.accountService.updatePortfolio(formData).subscribe({
            next: () => {
              this.clearForm();
              this.snack.success(this.translate.instant('editDialog.portfolio.success'));
              this.reloadPage();
            },
            error: (err) => {
              this.snack.error(this.translate.instant('editDialog.portfolio.error'));
              console.log(err)
            }
          });
        }
        break;
      case 'hourlyRate':
        this.accountService.updateHourlyRate(this.form.value).subscribe({
          next: () => {
            this.clearForm();
            this.reloadPage();
          },
          error: (err) => {
            this.snack.error(this.translate.instant('editDialog.hourlyRate.error'));
            console.log(err)
          }
        });
        break;
      default:
        console.error('Unknown edit type');
    }
  }

  clearForm() {
    // Reset the form to clear all values and mark it as pristine
    this.form.reset();
    // Clear the selected files array
    this.selectedFiles = [];
    this.dialogRef.close();
  }

  reloadPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
