interface Product {
    id: string;
    name: string;
    quantity: number;
}

class ProductRepository {

    private products: Product[] = [
        {
            id: "P101",
            name: "Keyboard",
            quantity: 12
        },
        {
            id: "P102",
            name: "Mouse",
            quantity: 20
        }
    ];

    findProduct(id: string): Product | undefined {
        if (!id || typeof id !== 'string' || !id.trim()) {
            console.warn('Invalid product ID provided');
            return undefined;
        }
        return this.products.find(p => p.id === id);
    }

}

class InventoryService {

    private repository =
        new ProductRepository();

    getInventory(productId: string) {

        const product =
            this.repository.findProduct(productId);

        if (!product) {
            return null;
        }

        return {
            productId: product.id,
            productName: product.name,
            availableQuantity: product.quantity
        };

    }

}

class InventoryController {

    private service =
        new InventoryService();

    execute(productId: string) {

        return this.service.getInventory(productId);

    }

}

function InventoryCard(data: any) {

    return {
        title: data.productName,
        stock: data.availableQuantity
    };

}

const controller =
    new InventoryController();

const result =
    controller.execute("P101");

if (result) {

    const card =
        InventoryCard(result);

    console.log(card);

}
