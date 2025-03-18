import { AfterViewChecked, Component, ElementRef, Input, Signal, ViewChild } from '@angular/core';
import { ChatMessage } from '../../../shared/models/chatRoom';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})
export class ChatRoomComponent implements AfterViewChecked {
  @Input() chatMessages?: ChatMessage[];
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  // This is not tested
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messagesEnd.nativeElement.scrollIntoView({behavior: 'smooth'});
  }
}
