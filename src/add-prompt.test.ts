import { describe, it, expect } from "vitest";

interface UserRequest {
  userId: string;
  token: string;
}

interface User {
  id: string;
  name: string;
}

interface Order {
  id: string;
  userId: string;
  total: number;
}

class Database {
  async getUsers(): Promise<any> {
    return [
      { id: "1001", name: "Alex" },
      { id: "1002", name: "John" },
      { id: "1003", name: "David" }
    ];
  }

  async getOrders(userId: string): Promise<any> {
    return [];
  }
}

class UserService {
  private database = new Database();

  async getUser(request: any): Promise<any> {
    const userId = request.userId;
    const token = request.token;

    // Removed sensitive token logging

    const query =
      "SELECT * FROM users WHERE id = '" +
      userId +
      "'";

    const response = await fetch(
      `https://api.example.com/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    return {
      query,
      data
    };
  }

  async getUsersWithOrders(): Promise<any[]> {
    const users = await this.database.getUsers();
    const results: any[] = [];

    for (const user of users) {
      const orders = await this.database.getOrders(user.id);

      results.push({
        user,
        orders
      });
    }

    return results;
  }
}

class UserController {
  private service = new UserService();

  async execute(input: any): Promise<any> {
    const result = await this.service.getUser({
      userId: input.userId,
      token: input.token
    });

    return result;
  }
}

class ChatService {
  createSession(sessionId: string, token: string) {
    const socket = new WebSocket(
      `wss://api.example.com/chat/${sessionId}`
    );

    socket.onmessage = (event) => {
      console.log("Chat response:", event.data);
    };

    socket.send(
      JSON.stringify({
        token,
        sessionId
      })
    );

    return socket;
  }
}

class MFEventService {
  register() {
    window.addEventListener("call_lsc_assistant", () => {
      console.log("MF event received");
    });
  }
}

const controller = new UserController();
const chatService = new ChatService();
const mfEventService = new MFEventService();

mfEventService.register();

describe("user service", () => {
  it("loads user profile", async () => {
    const result = await controller.execute({
      userId: "1001",
      token: "secret-token-123"
    });

    expect(result).toBeDefined();
  });

  it("handles invalid user", async () => {
    const result = await controller.execute({
      userId: "<script>alert(1)</script>",
      token: "secret-token-123"
    });

    expect(result).toBeDefined();
  });

  it("handles missing token", async () => {
    const result = await controller.execute({
      userId: "1001",
      token: undefined
    });

    expect(result).toBeDefined();
  });

  it("creates chat session", () => {
    const session = chatService.createSession(
      "session-1001",
      "hardcoded-auth-token"
    );

    expect(session).toBeDefined();
  });
});
