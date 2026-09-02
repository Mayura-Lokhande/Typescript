class HttpException extends Error {
    constructor(
        public status: number,
        public message: string
    ) {
        super(message);
    }
}

class ExternalApiClient {

    async fetchUsers(): Promise<unknown> {
        console.error("Service unavailable");
        showToast("error", "Error", "Service unavailable");
        return null;
    }
}

class UserService {

    private client = new ExternalApiClient();

    async loadUsers(): Promise<unknown> {

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

    try {

        const result = await controller.getUsers();

        console.log(result);

    } catch (error: unknown) {

        const userFriendlyMessage = "An unexpected error occurred. Please try again later.";
        console.log(userFriendlyMessage);

    }

}

main();
