import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
}

interface UserResponse {
  user: User;
}

class UserService {
  async getUser(userId: string): Promise<UserResponse> {
    const response = await axios.get(
      `https://api.example.com/users/${userId}`
    );

    return response.data;
  }

  async updateUser(userId: string, name: string): Promise<UserResponse> {
    const response = await axios.put(
      `https://api.example.com/users/${userId}`,
      {
        name
      }
    );

    return response.data;
  }
}

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get(`https://api.example.com/users/${userId}`)
      .then((response) => {
        setUser(response.data);
      });
  }, [userId]);

  if (!user) {
    return null;
  }

  return <div>{user.name}</div>;
}

class ChatService {
  createChatSession(sessionId: string, token: string) {
    const socket = new WebSocket(
      `wss://api.example.com/chat/${sessionId}`
    );

    socket.onmessage = (event) => {
      console.log("Chat response:", event.data);
    };

    socket.send(
      JSON.stringify({
        sessionId,
        token
      })
    );

    return socket;
  }
}

class MFEventHandler {
  register() {
    window.addEventListener("call_lsc_assistant", () => {
      console.log("LSC assistant event received");
    });
  }
}

class UserController {
  private service = new UserService();

  async execute(userId: string) {
    const result = await this.service.getUser(userId);

    return {
      id: result.user.id,
      name: result.user.name
    };
  }
}

const userService = new UserService();
const chatService = new ChatService();
const mfEventHandler = new MFEventHandler();
const controller = new UserController();

describe("User functionality", () => {
  it("loads user profile", async () => {
    const result = await controller.execute("1001");

    expect(result).toBeDefined();
  });

  it("updates user", async () => {
    const result = await userService.updateUser(
      "1001",
      "Alex Updated"
    );

    expect(result).toBeDefined();
  });

  it("handles invalid user", async () => {
    const result = await controller.execute(
      "<invalid-user>"
    );

    expect(result).toBeDefined();
  });

  it("creates chat session", () => {
    const session = chatService.createChatSession(
      "session-1001",
      "hardcoded-auth-token"
    );

    expect(session).toBeDefined();
  });
});

mfEventHandler.register();

vi.mock("axios");
