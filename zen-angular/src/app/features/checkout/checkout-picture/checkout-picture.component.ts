import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { Appointment } from '../../../shared/models/appointment';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout-picture',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatLabel,
    MatButton,
    CommonModule,
    MatInputModule,
    MatLabel,
    TranslateModule
  ],
  templateUrl: './checkout-picture.component.html',
  styleUrl: './checkout-picture.component.scss'
})
export class CheckoutPictureComponent implements OnInit {
  @Input() appointment!: Appointment;

  private fb = inject(FormBuilder);
  private snack = inject(SnackbarService);
  private translate = inject(TranslateService);

  @Output() pictureSelected = new EventEmitter<Appointment>();
  @Output() pictureComplete = new EventEmitter<boolean>();

  form = this.fb.group({
    description: ['', Validators.required],
    pictures: [<File[]>[], Validators.required]
  })

  selectedFiles: File[] = [];
  isDragging = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {
    this.listenForChanges();
    document.addEventListener('drop', (event) => {
      event.preventDefault();
    });
  }

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
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
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
    const remainingSlots = 3 - this.selectedFiles.length; // Calculate how many more files can be added
    if (remainingSlots <= 0) {
      this.snack.error(this.translate.instant('editDialog.portfolio.maxFilesError'));
      return;
    }

    // Limit the number of files to the remaining slots
    const validFiles = files.filter(file => this.isValidFileType(file)).slice(0, remainingSlots);

    this.selectedFiles.push(...validFiles);
    this.form.patchValue({ pictures: this.selectedFiles });

    if (validFiles.length < files.length) {
      this.snack.error(this.translate.instant('editDialog.portfolio.fileTypeError'));
    }
  }

  isValidFileType(file: File) {
    const allowedTypes = ['image/png', 'image/jpeg'];
    return allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024; // Max 5MB
  }

  getFileNames() {
    return this.selectedFiles.map(file => file.name).join(', ');
  }

  removeFiles() {
    this.selectedFiles = [];
    this.form.controls['pictures'].setValue(this.selectedFiles);
  }

  listenForChanges() {
    this.form.valueChanges.subscribe(value => {
      this.appointment.description = value.description || '';
      this.appointment.pictures = this.selectedFiles;
      this.pictureSelected.emit(this.appointment);
      this.pictureComplete.emit(this.form.valid);
    });
  }
}
