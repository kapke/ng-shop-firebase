export class Product {
    public readonly id = '';
    public readonly name = '';
    public readonly price = 0;
    public readonly imageUrl = '';

    constructor (data: Partial<Product>) {
        Object.assign(this, data);
    }
}
