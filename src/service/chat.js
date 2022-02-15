export default class ChatService {
    constructor(http, socket) {
        this.http = http;
        this.socket = socket;
    }

    async getChats(roomname) {
        return this.http.fetch(`/chats/${roomname}`, {
            method: 'GET',
        });
    }

    async getChatRooms() {
        return this.http.fetch('/chats', {
            method: "GET"
        })
    }

    async postChat(text, id) {
        return this.http.fetch(`/chats/${id}`, {
            method: "POST",
            body: JSON.stringify({text})
        })

    }

    async createRoom(name) {
        return this.http.fetch(`/chats`, {
            method: "POST",
            body:JSON.stringify({name})
        })
    }

    
  onSync(callback) {
    return this.socket.onSync('tweets', callback);
  }
}