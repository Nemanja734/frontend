import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../shared/models/appointment';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { AccountService } from '../../core/services/account.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { AppointmentStatusPipe } from "../../shared/pipes/appointment-status.pipe";
import { EnumConverterService } from '../../core/services/enum-converter.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Observable } from 'rxjs';
import { Pagination } from '../../shared/models/pagination';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { GlobalCurrencyPipe } from '../../shared/pipes/global-currency.pipe';
import { MatDivider } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    MatButton,
    MatMenuModule,
    CommonModule,
    MatCardModule,
    MatSelectionList,
    MatListOption,
    FormsModule,
    AppointmentStatusPipe,
    RouterLink,
    PaginatorComponent,
    EmptyStateComponent,
    GlobalCurrencyPipe,
    MatDivider,
    TranslateModule
],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  @ViewChild('statusMenuTrigger') statusMenuTrigger!: MatMenuTrigger;

  accountService = inject(AccountService);
  private appointmentService = inject(AppointmentService);
  private dialog = inject(MatDialog);
  private enumService = inject(EnumConverterService);
  private snack = inject(SnackbarService);
  private router = inject(Router);

  availableStatus: string[] = ["Paid", "Declined", "Accepted", "Canceled", "Done"];
  selectedstatus: string[] = ["Paid", "Accepted", "Done"];
  appointments: Pagination<Appointment> | null = null;

  // Query params
  statusEnum: number[] = [];
  page: number = 1;

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments() {
    this.statusEnum = this.enumService.statusToNumber(this.selectedstatus);
    this.appointmentService.getAppointments(this.statusEnum, this.page).subscribe({
      next: appointments => {
        this.appointments = appointments;
      }
    });
  }

  // Filter
  handleFilterEvent() {
    this.statusMenuTrigger.closeMenu();
    this.getAppointments();
  }

  resetFilters() {
    this.selectedstatus = ["Paid", "Accepted", "Done"];
    this.getAppointments();
  }

  // Stop Mat Menu from closing
  stopPropagation(event: any) {
    event.stopPropagation();
  }

  handlePageEvent(event: number) {
    this.page = event;
    this.getAppointments();
  }





  // Method to open confirmation dialog and call appointmentService methods if confirmed
  confirmAction(title: string, message: string, action: () => Observable<any>) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title, message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Execute the observable if user confirms
        action().subscribe(() => {
          this.getAppointments();
        });
      }
    });
  }

  // Appointment management is currently all on the appointment detail page
  // removeAppointment(id: number) {
  //   this.confirmAction(
  //     'Remove Appointment',
  //     'Are you sure you want to remove this appointment?',
  //     () => this.appointmentService.removeAppointment(id)
  //   );
  // }

  // declineAppointment(id: number) {
  //   this.confirmAction(
  //     'Decline Appointment',
  //     'Are you sure you want to decline this appointment?',
  //     () => this.appointmentService.declineAppointment(id)
  //   );
  // }

  // acceptAppointment(id: number) {
  //   this.confirmAction(
  //     'Accept Appointment',
  //     'Do you want to accept this appointment?',
  //     () => this.appointmentService.acceptAppointment(id)
  //   );
  // }

  // cancelAsCustomer(id: number) {
  //   this.confirmAction(
  //     'Cancel Appointment',
  //     'Are you sure you want to cancel this appointment?',
  //     () => this.appointmentService.cancelAsCustomer(id)
  //   );
  // }

  // doneAppointment(id: number) {
  //   // Open dialog to submit appointment progress
  //   const dialogRef = this.dialog.open(DoneDialogComponent, {
  //     minWidth: '500px'
  //   });
  //   dialogRef.afterClosed().subscribe({
  //     next: result => {
  //       if (result) {
  //         this.appointmentDone = {
  //           appointmentId: id,
  //           done: result.done,
  //           timeToday: result.timeToday
  //         }
  //         this.appointmentService.doneAppointment(this.appointmentDone).subscribe({
  //           next: () => {
  //             this.snack.success("Appointment updated successfully!")
  //           },
  //           error: err => this.snack.error(err.error.message)
  //         });
  //       }
  //     }
  //   })
  // }

  redirectToShowroom() {
    this.router.navigateByUrl('/showroom');
  }
}
