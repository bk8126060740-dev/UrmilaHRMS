import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { JwtService } from './jwtService.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {

  constructor(private jwtService: JwtService) { }

  private hubConnection: signalR.HubConnection | null = null;
  hubUrl: string = 'https://api.hrmsuistech.in/hubs/NotificationHub';

  startConnection(hubUrl: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()

      .withUrl(`${this.hubUrl}?userId=${this.jwtService.getNameIdentifier()}`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => { })
      .catch(err => console.error('Error establishing SignalR connection:', err));

  }

  on(eventName: string, callback: (...args: any[]) => void): void {

    if (this.hubConnection) {
      this.hubConnection.on(eventName, callback);
    }
  }

  getConnectionState(): string | null {
    return this.hubConnection?.state || null;
  }

  send(eventName: string, ...args: any[]): void {
    if (this.hubConnection) {
      this.hubConnection.invoke(eventName, ...args).catch(err => console.error(err));
    }
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => { })
        .catch(err => console.error('Error stopping SignalR connection:', err));
    }
  }

  isNotificationSupported(): boolean {
    return 'Notification' in window;
  }

  requestNotificationPermission(): void {
    if (this.isNotificationSupported()) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // Notification permission granted
        } else {
          // Notification permission denied
        }
      });
    } else {
      console.error('Notifications are not supported by this browser.');
    }
  }

  showNotification(title: string, body: string): void {
    if (this.isNotificationSupported() && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: 'path_to_icon.png',
      });
    }
  }

}

