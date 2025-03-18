import { Component, EventEmitter, inject, OnInit, output, Output } from '@angular/core';
import { AccountService } from '../../../core/services/account.service';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appointment } from '../../../shared/models/appointment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppointmentStatusPipe } from '../../../shared/pipes/appointment-status.pipe';
import { QualityPipe } from '../../../shared/pipes/quality.pipe';
import { SizePipe } from '../../../shared/pipes/size.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [
    MatRadioModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    QualityPipe,
    SizePipe,
    TranslateModule
  ],
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.scss'
})
export class Step1Component implements OnInit {
  accountService = inject(AccountService);
  private tf = inject(FormBuilder);

  @Output() tattooDtoSelected = new EventEmitter<Appointment>();
  tattooComplete = output<boolean>();

  tattooForm = this.tf.group({
    bodyPart: ['', Validators.required],
    quality: [null, Validators.required],
    size: [null, Validators.required],
  })

  ngOnInit(): void {
    this.accountService.getQualityOptions().subscribe();
    this.accountService.getSizeOptions().subscribe();
    this.listenForChanges();
  }

  listenForChanges() {
    this.tattooForm.valueChanges.subscribe((value) => {
      let { bodyPart, quality, size } = value;

      // Remove all spaces from the selected quality value
      // quality = quality?.replace(/\s+/g, '');

      if (bodyPart && quality != null && size != null) {
        const tattooDto: Appointment = {
          artistId: 0,
          bodyPart,
          quality,
          size
        }
        this.tattooComplete.emit(true);
        this.tattooDtoSelected.emit(tattooDto);
      }
    })
  }
}
