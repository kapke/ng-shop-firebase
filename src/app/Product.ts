import { Record } from 'immutable';

export interface ProductData {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

export const EMPTY_PRODUCT: ProductData = {id: '', name: '', price: 0, imageUrl: ''};

export class Product extends Record(EMPTY_PRODUCT, 'Product') implements ProductData {
    public id: string;
    public name: string;
    public price: number;
    public imageUrl: string;
}
