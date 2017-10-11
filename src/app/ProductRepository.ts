import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Product } from './Product';
import { List } from 'immutable';


export interface ProductRepositoryInterface {
    productListChange$: Observable<List<Product>>;

    findAll (): Observable<List<Product>>;
    add (product: Product): Observable<Product>;
}

export abstract class ProductRepository implements ProductRepositoryInterface {
    abstract productListChange$: Observable<List<Product>>;

    abstract findAll (): Observable<List<Product>>;
    abstract add (product: Product): Observable<Product>;
}

@Injectable()
export class HttpFireBaseProductRepository implements ProductRepositoryInterface {
    productListChange$: Subject<List<Product>> = new Subject();

    constructor (private http: Http) {}

    findAll (): Observable<List<Product>> {
        return this.http.get('https://shining-torch-4509.firebaseio.com/products.json')
            .map(res => res.json())
            .map(data => Object.keys(data)
                .map(name => new Product({id: name, ...data[name]})))
            .map(data => List(data));
    }

    add (product: Product): Observable<Product> {
        const data = product.toObject();
        delete data.id;

        const headers = new Headers({ 'Content-Type': 'application/json' });
        const observable = this.http.post('https://shining-torch-4509.firebaseio.com/products.json', data, new RequestOptions({ headers }));

        return observable
            .map(res => res.json())
            .map(data1 => new Product(data1))
            .do(() => this.emitNewProductList());
    }

    private emitNewProductList (): void {
        this.findAll()
            .map(products => this.productListChange$.next(products));
    }
}
