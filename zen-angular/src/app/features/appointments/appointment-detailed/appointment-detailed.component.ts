import { Component, inject, OnInit } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Appointment, AppointmentDone } from '../../../shared/models/appointment';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { ShowroomService } from '../../../core/services/showroom.service';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user';
import { AccountService } from '../../../core/services/account.service';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card.pipe';
import { AppointmentStatusPipe } from '../../../shared/pipes/appointment-status.pipe';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { QualityEnumPipe } from '../../../shared/pipes/quality-enum.pipe';
import { SizeEnumPipe } from '../../../shared/pipes/size-enum.pipe';
import { DoneDialogComponent } from '../../../shared/components/done-dialog/done-dialog.component';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { GlobalCurrencyPipe } from '../../../shared/pipes/global-currency.pipe';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment-detailed',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    DatePipe,
    RouterLink,
    MatDivider,
    CommonModule,
    PaymentCardPipe,
    AppointmentStatusPipe,
    QualityEnumPipe,
    SizeEnumPipe,
    GlobalCurrencyPipe,
    TranslateModule
  ],
  templateUrl: './appointment-detailed.component.html',
  styleUrl: './appointment-detailed.component.scss'
})
export class AppointmentDetailedComponent implements OnInit {
  accountService = inject(AccountService);
  private appointmentService = inject(AppointmentService);
  private showroomService = inject(ShowroomService);
  private activatedRoute = inject(ActivatedRoute);
  private snack = inject(SnackbarService);
  private dialog = inject(MatDialog);
  private breakpointObserver = inject(BreakpointObserver);
  private translate = inject(TranslateService);

  appointment?: Appointment;
  artist?: User;
  appointmentDone?: AppointmentDone;

  isMobile: boolean = false;

  ngOnInit(): void {
    this.loadAppointment();

    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  loadAppointment() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.appointmentService.getAppointmentDetailed(+id).subscribe({
      next: appointment => {
        this.appointment = appointment
        // Get artist with id after appointment loaded
        this.loadArtist();
      }
    })
  }

  loadArtist() {
    this.showroomService.getArtist(this.appointment?.artistId!).subscribe(a => {
      this.artist = a;
      this.loadAddress();
    });
  }

  loadAddress() {
    this.showroomService.getAddress(this.appointment?.artistId!).subscribe(address => this.artist!.address = address)
  }

  // Method to open confirmation dialog and call appointmentService methods if confirmed
  confirmAction(title: string, message: string, action: () => Observable<any>) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title, message }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Execute the observable if user confirms
        action().subscribe(() => window.location.reload());
      }
    });
  }

  // Appointment management
  removeAppointment(id: number) {
    this.confirmAction(
      this.translate.instant('appointmentActions.removeTitle'),
      this.translate.instant('appointmentActions.removeMessage'),
      () => this.appointmentService.removeAppointment(id)
    );
  }

  declineAppointment(id: number) {
    this.confirmAction(
      this.translate.instant('appointmentActions.declineTitle'),
      this.translate.instant('appointmentActions.declineMessage'),
      () => this.appointmentService.declineAppointment(id)
    );
  }

  acceptAppointment(id: number) {
    this.confirmAction(
      this.translate.instant('appointmentActions.acceptTitle'),
      this.translate.instant('appointmentActions.acceptMessage'),
      () => this.appointmentService.acceptAppointment(id)
    );
  }

  cancelAsCustomer(id: number) {
    this.confirmAction(
      this.translate.instant('appointmentActions.cancelTitle'),
      this.translate.instant('appointmentActions.cancelMessage'),
      () => this.appointmentService.cancelAsCustomer(id)
    );
  }

  doneAppointment(id: number) {
    // Open dialog to submit appointment progress
    const dialogRef = this.dialog.open(DoneDialogComponent, {
      minWidth: '500px'
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.appointmentDone = {
            appointmentId: id,
            done: result.done,
            timeToday: result.timeToday
          };
          this.appointmentService.doneAppointment(this.appointmentDone).subscribe({
            next: () => {
              this.snack.success(this.translate.instant('appointmentActions.doneSuccess'));
            },
            error: err => {
              this.snack.error(err.error);
              console.error(err);
            }
          });
        }
      }
    });
  }
}
