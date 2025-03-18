import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../shared/models/user';
import { Appointment } from '../../shared/models/appointment';
import { Pagination } from '../../shared/models/pagination';
import { ShopParams } from '../../shared/models/shopParams';
import {MatTableModule} from '@angular/material/table'; 
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RefundComponent } from './refund/refund.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    PaginatorComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    MatFormFieldModule,
    MatInput,
    MatLabel,
    FormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  private adminService = inject(AdminService);
  private snack = inject(SnackbarService);
  private dialog = inject(MatDialog);

  userParams = new ShopParams();
  appointmentParams = new ShopParams();
  users?: Pagination<User>;
  appointments?: Pagination<Appointment>;

  ngOnInit(): void {
    this.getUsers();
    this.getAppointments();
  }

  // User table
  getUsers() {
    this.adminService.getUsers(this.userParams).subscribe(result => this.users = result);
  }

  deactivateUser(email: string) {
    this.adminService.deactivateUser(email).subscribe({
      next: () => this.snack.success("User deactivated"),
      error: err => this.snack.error("Error:" + err.message)
    });
  }

  handleUserPageEvent(event: number) {
    this.userParams.pageNumber = event;
    this.getAppointments();
  }

  // Appointment table
  getAppointments() {
    this.adminService.getAppointments(this.appointmentParams).subscribe(result => this.appointments = result);
  }

  refundAppointment(id: number) {
    const dialogRef = this.dialog.open(RefundComponent, {
      minWidth: '500px'
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.adminService.refundAppointment(id, result).subscribe({
            next: () => this.snack.success("Appointment refund successful"),
            error: err => this.snack.error("Refund error: " + err)
          })
        }
      }
    })
  }
}
