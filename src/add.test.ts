interface User {
  id: number;
  name: string;
}

class Database {
  async getUsers(): Promise<User[]> {
    return [
      { id: 1, name: "Alex" },
      { id: 2, name: "John" },
      { id: 3, name: "David" }
    ];
  }

  async getUserOrders(userId: number): Promise<unknown[]> {
    return [];
  }
}

class UserService {
  private database = new Database();

  async getUsersWithOrders(): Promise<unknown[]> {
    const users = await this.database.getUsers();
    const results: unknown[] = [];

    for (const user of users) {
      const orders = await this.database.getUserOrders(user.id);

      results.push({
        user,
        orders
      });
    }

    return results;
  }
}

async function main(): Promise<void> {
  const service = new UserService();
  const users = await service.getUsersWithOrders();

  console.log(users);
}

main();