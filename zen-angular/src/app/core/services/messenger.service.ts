import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { ChatMessage, ChatRoom } from '../../shared/models/chatRoom';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { MessengerComponent } from '../../features/messenger/messenger.component';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private chatUrl = environment.chatUrl;

  chatConnection?: HubConnection;
  chatGroups?: ChatRoom[];

  // Signal for the most recently received message
  recentMessage = signal<ChatMessage | null>(null);
  selectedGroup = signal<ChatRoom | null>(null);
  unread = signal<number>(0);

  async createHubConnection() {
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(this.chatUrl, { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // Create connection
    await this.chatConnection.start().catch(err => console.log("Failed to connect to SignalR hub", err));

    // Listen to messages
    this.chatConnection.on("ReceiveMessage", (chatMessage: ChatMessage) => {
      this.recentMessage.set(chatMessage);
      if (this.selectedGroup()?.id !== chatMessage.chatRoomId || this.selectedGroup()?.id === null) {
        this.unread.update(unread => unread + 1);
      }
    })

    // Get chat groups and join each room
    this.chatGroups = await firstValueFrom(this.getChatGroups());
    this.chatGroups.forEach(group => {
      this.chatConnection!.invoke("JoinChatRoom", group.id);
    });

    // Get number of unread messages
    this.getNumberOfUnread().subscribe();
  }

  async sendMessage(message: ChatMessage) {
    if (this.chatConnection) {
      await this.chatConnection.invoke("SendMessage", message.chatRoomId, message.senderEmail, message.message)
    }
  }

  // Gets all groups of a user
  getChatGroups() {
    return this.http.get<ChatRoom[]>(this.baseUrl + 'messenger/groups');
  }

  // Gets messages of Chat with ChatGroupId
  getGroupMessages(id: number) {
    return this.http.get<ChatMessage[]>(this.baseUrl + 'messenger/' + id);
  }

  // Gets number of unread messages for user
  getNumberOfUnread() {
    return this.http.get<number>(this.baseUrl + 'messenger/unread').pipe(
      map(number => {
        this.unread.set(number);
        return number;
      })
    );
  }

  // Read all messages of group
  readMessages(id: number) {
    return this.http.get<number>(this.baseUrl + 'messenger/read/' + id).pipe(
      map(number => {
        this.unread.update(n => n - number);
        return number;
      })
    );
  }

  // Stop connection at logout
  stopHubConnection() {
    if (this.chatConnection?.state === HubConnectionState.Connected) {
      this.chatConnection.stop().catch(err => console.error(err));
    }
  }
}
