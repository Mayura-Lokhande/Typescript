class HttpException extends Error {
    constructor(
        public status: number,
        public message: string
    ) {
        super(message);
    }
}

class ExternalApiClient {

    async fetchUsers(): Promise<any> {
        throw new Error("Service unavailable");
    }
}

class UserService {

    private client = new ExternalApiClient();

    async loadUsers(): Promise<User[]> {

        try {

            const result = await this.client.fetchUsers();

            return result;

        } catch (error) {

            throw new HttpException(
                502,
                "Failed to retrieve users from external service"
            );

        }

    }

}

class UserController {

    private service = new UserService();

    async getUsers() {

        return await this.service.loadUsers();

    }

}

async function main() {

    const controller = new UserController();
    

}

main();
