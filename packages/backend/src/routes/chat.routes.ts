import type { FastifyInstance } from 'fastify';
import { chatService } from '../services/chat.service.js';

export default async function chatRoutes(fastify: FastifyInstance) {
  fastify.get('/chat', { websocket: true }, (socket, request) => {
    let currentRoom = 'general';
    let currentUser: { id: number; username: string } | null = null;

    // Join default room
    const socketId = Math.random().toString(36).substr(2, 9);
    chatService.joinRoom(currentRoom, socketId);

    // Send welcome message and chat history
    socket.socket.send(
      JSON.stringify({
        type: 'connected',
        room: currentRoom,
        userCount: chatService.getRoomUsers(currentRoom),
        messages: chatService.getMessages(currentRoom),
      })
    );

    socket.socket.on('message', (rawMessage: Buffer) => {
      try {
        const data = JSON.parse(rawMessage.toString());

        switch (data.type) {
          case 'auth':
            // Simple authentication - in real app, verify JWT
            currentUser = {
              id: data.userId || Math.floor(Math.random() * 1000),
              username: data.username || 'Anonymous',
            };
            socket.socket.send(
              JSON.stringify({
                type: 'auth_success',
                user: currentUser,
              })
            );
            break;

          case 'join':
            // Leave current room
            chatService.leaveRoom(currentRoom, socketId);

            // Join new room
            currentRoom = data.room || 'general';
            chatService.joinRoom(currentRoom, socketId);

            socket.socket.send(
              JSON.stringify({
                type: 'joined',
                room: currentRoom,
                userCount: chatService.getRoomUsers(currentRoom),
                messages: chatService.getMessages(currentRoom),
              })
            );
            break;

          case 'message':
            if (!currentUser) {
              socket.socket.send(
                JSON.stringify({
                  type: 'error',
                  message: 'Please authenticate first',
                })
              );
              return;
            }

            const chatMessage = {
              id: `${Date.now()}-${Math.random()}`,
              userId: currentUser.id,
              username: currentUser.username,
              message: data.message,
              timestamp: new Date().toISOString(),
            };

            chatService.addMessage(currentRoom, chatMessage);

            // Broadcast to all clients in room (simplified - sends to all)
            fastify.websocketServer.clients.forEach((client: any) => {
              if (client.readyState === 1) {
                client.send(
                  JSON.stringify({
                    type: 'message',
                    room: currentRoom,
                    data: chatMessage,
                  })
                );
              }
            });
            break;

          case 'typing':
            // Broadcast typing indicator
            fastify.websocketServer.clients.forEach((client: any) => {
              if (client !== socket.socket && client.readyState === 1) {
                client.send(
                  JSON.stringify({
                    type: 'typing',
                    username: currentUser?.username || 'Someone',
                  })
                );
              }
            });
            break;

          default:
            socket.socket.send(
              JSON.stringify({
                type: 'error',
                message: 'Unknown message type',
              })
            );
        }
      } catch (error) {
        socket.socket.send(
          JSON.stringify({
            type: 'error',
            message: 'Invalid message format',
          })
        );
      }
    });

    socket.socket.on('close', () => {
      chatService.leaveRoom(currentRoom, socketId);
    });
  });
}
