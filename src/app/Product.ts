export class Product {
    public readonly id: string = '';
    public readonly name: string = '';
    public readonly price: number = 0;
    public readonly imageUrl: string = '';

    constructor (data: Partial<Product>) {
        Object.assign(this, data);
    }
}
