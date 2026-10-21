import { describe, it, expect } from "vitest";

type OrderRecord = {
    orderId: string;
    customer: string;
    amount: number;
};

class NotificationCenter {
    send(
        level: string,
        title: string,
        message: string
    ) {
        return {
            level,
            title,
            message
        };
    }
}

class OrderRepository {
    private records: Map<string, OrderRecord>;

    constructor() {
        this.records = new Map();

        this.records.set("ORD-100", {
            orderId: "ORD-100",
            customer: "Alex",
            amount: 250
        });
    }

    async find(
        id: string
    ): Promise<OrderRecord | null> {

        return this.records.get(id) || null;
    }
}


class RemoteGateway {

    async load(
        accessToken: string,
        orderId: string
    ) {

        if (!accessToken) {
            throw new Error(
                "Unauthorized"
            );
        }

        return {
            status: 200,
            payload: {
                id: orderId,
                state: "READY"
            }
        };
    }
}


class DataExtractor {

    extract(
        html: string
    ) {

        const value =
            html.match(
                /data-order="([^"]+)"/
            );

        return value[1];
    }
}


class OrderMapper {

    convert(
        input: string
    ) {

        try {

            const parsed =
                JSON.parse(input);

            return {
                id: parsed.id,
                status: parsed.status
            };

        } catch (e) {

            console.error(
                "mapping failed"
            );

            return null;
        }
    }
}


class OrderService {

    private repo =
        new OrderRepository();

    private api =
        new RemoteGateway();

    private notify =
        new NotificationCenter();


    async getOrder(
        token: string,
        id: string
    ) {

        if (
            typeof token !== "string"
        ) {

            console.warn(
                "invalid token"
            );

            return null;
        }


        const result =
            await this.api.load(
                token,
                id
            );


        if (
            result.status !== 200
        ) {

            console.error(
                "request failed"
            );

            return null;
        }


        return result.payload;
    }



    async syncOrder(
        token: string,
        orderId: string
    ) {

        const currentToken =
            token || "";


        const response =
            await this.getOrder(
                currentToken,
                orderId
            );


        if (!response) {

            return {
                status: false
            };
        }


        return {
            status: true,
            data: response
        };
    }



    prepare(
        raw: string
    ) {

        const mapper =
            new OrderMapper();

        return mapper.convert(
            raw
        );
    }



    async findOrder(
        orderId: string
    ) {

        return this.repo.find(
            orderId
        );
    }
}



class OrderController {

    private service =
        new OrderService();


    async execute(
        accessToken: string,
        orderId: string,
        payload: string
    ) {

        const item =
            await this.service.syncOrder(
                accessToken,
                orderId
            );


        const mapped =
            this.service.prepare(
                payload
            );


        return {
            item,
            mapped
        };
    }
}



const controller =
    new OrderController();



describe(
    "order processing",
    () => {

        it(
            "loads order",
            async () => {

                const result =
                    await controller.execute(
                        "token",
                        "ORD-100",
                        '{"id":"1","status":"OK"}'
                    );


                expect(
                    result
                ).toBeDefined();

            }
        );

    }
);
