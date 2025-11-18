export interface ChatMessage {
  id: string;
  userId: number;
  username: string;
  message: string;
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  users: Set<string>;
  messages: ChatMessage[];
}

class ChatService {
  private rooms: Map<string, ChatRoom> = new Map();

  constructor() {
    // Initialize default room
    this.rooms.set('general', {
      id: 'general',
      name: 'General Chat',
      users: new Set(),
      messages: [],
    });
  }

  joinRoom(roomId: string, socketId: string): ChatRoom {
    let room = this.rooms.get(roomId);
    if (!room) {
      room = {
        id: roomId,
        name: roomId,
        users: new Set(),
        messages: [],
      };
      this.rooms.set(roomId, room);
    }
    room.users.add(socketId);
    return room;
  }

  leaveRoom(roomId: string, socketId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.users.delete(socketId);
      if (room.users.size === 0 && roomId !== 'general') {
        this.rooms.delete(roomId);
      }
    }
  }

  addMessage(roomId: string, message: ChatMessage): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.messages.push(message);
      // Keep only last 100 messages
      if (room.messages.length > 100) {
        room.messages = room.messages.slice(-100);
      }
    }
  }

  getMessages(roomId: string, limit: number = 50): ChatMessage[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return room.messages.slice(-limit);
  }

  getRoomUsers(roomId: string): number {
    const room = this.rooms.get(roomId);
    return room ? room.users.size : 0;
  }
}

export const chatService = new ChatService();
