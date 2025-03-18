export type ChatRoom = {
    id: number
    appointmentId: number
    artistEmail: string
    customerEmail: string
    createdDate: string
    imageUrl: string
    messages: ChatMessage[]
    lastMessage?: string
    isRead?: boolean    // For checking if the last message of this chat room is read
}

// For sending messages, we need the id and appointment date of the chat
export type ChatMessage = {
    id?: number
    chatRoomId: number
    senderEmail: string
    message: string
    timestamp?: string
    read?: boolean
    isSeparator?: boolean
}