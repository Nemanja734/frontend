import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from '../../core/services/account.service';
import { firstValueFrom } from 'rxjs';
import { MessengerService } from '../../core/services/messenger.service';
import { ChatMessage, ChatRoom } from '../../shared/models/chatRoom';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatCard,
    MatListModule,
    MatDivider,
    MatIconModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.scss'
})
export class MessengerComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  accountService = inject(AccountService);
  private messengerService = inject(MessengerService);
  private breakpointObserver = inject(BreakpointObserver);
  private translate = inject(TranslateService);

  chatGroups: ChatRoom[] = [];
  selectedGroup?: ChatRoom | undefined;
  chatMessages: ChatMessage[] = [];

  isMobile: boolean = false;
  messageText?: string;

  constructor() {
    this.breakpointObserver.observe(['(max-width: 1024px)']).subscribe(result => {
      this.isMobile = result.matches;
    });

    // Update the last message for the corresponding group
    effect(() => {
      // Reactively track changes in chat groups
      const recentMessage = this.messengerService.recentMessage();
      if (recentMessage) {
        // Find the corresponding chat group
        const group = this.chatGroups.find(
          group => group.id === recentMessage.chatRoomId
        );
        if (group) {
          // Update the group's messages and last message if it is the selected group
          if (this.selectedGroup?.id === group.id) {
            this.addMessageWithSeparator(recentMessage);
            // Set isRead locally
            group.isRead = true;
            // Set isRead in the database, so it doesn't count up when you refresh the page
            this.messengerService.readMessages(group.id).subscribe();
          } else {
            group.isRead = false;
          }
          // Update last message of corresponding group
          group.lastMessage = recentMessage.message;
        }
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.getChatGroups();
  }

  ngOnDestroy(): void {
    this.messengerService.selectedGroup.set(null);
  }

  unselectGroup() {
    this.selectedGroup = undefined;
  }

  getChatGroups() {
    this.messengerService.getChatGroups().subscribe({
      next: groups => {
        // Get every ChatRoom and check if the last message is read. Important for the right style of the ChatRoom in the sidebar.
        groups.forEach(group => {
          const lastMessage = group.messages[group.messages.length - 1];
          if (lastMessage && (lastMessage.read || lastMessage.senderEmail === this.accountService.currentUser()?.email)) {
            group.isRead = true;
          } else {
            group.isRead = false;
          }
        });
        this.chatGroups = groups;
      },
      error: err => console.error('Failed fetching the chat groups:', err)
    });
  }

  async selectChatGroup(group: ChatRoom) {
    // Read all messages of group and then save it to various variables
    group.isRead = true;
    // Set the signal first so the right messages are getting passed from the messenger service
    this.messengerService.selectedGroup.set(group);
    this.selectedGroup = this.messengerService.selectedGroup()!;
    // Clear existing messages and load new ones
    const messages = await firstValueFrom(this.messengerService.getGroupMessages(group.id));
    this.chatMessages = this.processMessagesWithSeparators(messages);
    this.scrollToBottom();
    // Read all messages of group in API
    this.messengerService.readMessages(group.id).subscribe();
  }

  async sendMessage() {
    if (this.messageText && this.messageText.trim()) {
      const chatMessage: ChatMessage = {
        chatRoomId: this.selectedGroup?.id!,
        senderEmail: this.accountService.currentUser()?.email!,
        message: this.messageText
      };
      await this.messengerService.sendMessage(chatMessage);
      this.messageText = '';
    }
  }

  // Helper function to process messages and insert date separators where necessary
  private addMessageWithSeparator(newMessage: ChatMessage) {
    if (this.chatMessages[this.chatMessages.length - 1]) {
      const lastMessage = this.chatMessages[this.chatMessages.length - 1];
      const lastMessageDate = new Date(lastMessage.timestamp!).toDateString();
      const newMessageDate = new Date(newMessage.timestamp!).toDateString();

      // If the date of the new message is different, add a separator
      if (newMessageDate !== lastMessageDate) {
        this.chatMessages.push({
          chatRoomId: newMessage.chatRoomId,
          message: newMessageDate,
          timestamp: newMessage.timestamp,
          senderEmail: "",
          isSeparator: true
        });
      }

      // Add the new message itself
      this.chatMessages.push({ ...newMessage, isSeparator: false });
      this.scrollToBottom();
    }
  }

  private processMessagesWithSeparators(messages: ChatMessage[]): ChatMessage[] {
    const processedMessages: ChatMessage[] = [];
    let lastDate: string | null = null;

    // If no messages exist, add a default separator message
    if (messages.length === 0) {
      this.translate.get('messenger.firstQuestion').subscribe((translatedText: string) => {
        processedMessages.push(this.pasteSeparatorMessage(translatedText));
      });
      return processedMessages;
    }

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp!).toDateString();
      // Insert a date separator if the date changes
      if (messageDate !== lastDate) {
        processedMessages.push(this.pasteSeparatorMessage(messageDate));
        lastDate = messageDate;
      }

      // Push the actual message
      processedMessages.push({ ...message, isSeparator: false });
    });

    return processedMessages;
  }

  private pasteSeparatorMessage(message: string): ChatMessage {
    return {
      chatRoomId: 0,
      message: message,
      timestamp: "",
      senderEmail: "",
      isSeparator: true // Flag to indicate this is a separator
    };
  }

  // Scroll to the bottom of the message container
  private scrollToBottom() {
    setTimeout(() => {
      try {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Could not scroll to bottom:', err);
      }
    }, 0);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
