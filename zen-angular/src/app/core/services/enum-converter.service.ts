import { Injectable } from '@angular/core';
import { AppointmentStatus } from '../../shared/models/appointment';

@Injectable({
  providedIn: 'root'
})
export class EnumConverterService {

  statusToNumber(status: string[]): number[] {
    return status.map(status => {
      const statusNumber = Object.keys(AppointmentStatus).find(
        key => AppointmentStatus[key as any] === status
      );
      return statusNumber !== undefined ? Number(statusNumber) : -1;
    });
  }
}
