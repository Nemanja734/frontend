import { Pipe, PipeTransform } from '@angular/core';
import { AppointmentStatus } from '../models/appointment';

@Pipe({
  name: 'appointmentStatus',
  standalone: true
})
export class AppointmentStatusPipe implements PipeTransform {

  transform(value: number): string {
    return AppointmentStatus[value] || 'Unknown Status';
  }
}
