import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Appointment } from '../../shared/models/appointment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Notifications Hub
  private hubUrl = environment.hubUrl;
  hubConnection?: HubConnection;
  appointmentSignal = signal<Appointment | null>(null);

  // Create connection to Notifications Hub and Chat Hub on login
  async createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(err => console.log(err));

    this.hubConnection.on('AppointmentCompleteNotification', (appointment: Appointment) => {
      this.appointmentSignal.set(appointment)
    });
  }

  // Stop connection to Notifications Hub and Chat Hub on logout
  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(err => console.error(err));
    }
  }
}
