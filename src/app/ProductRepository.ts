import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { List } from 'immutable';

import { Product } from './Product';


export abstract class ProductRepository {
    abstract productListChange$: Observable<List<Product>>;

    abstract simpleFindAll (): Observable<List<Product>>;
    abstract fancyFindAll (): Observable<List<Product>>;
    abstract add (product: Product): Observable<Product>;
}

@Injectable()
export class HttpFireBaseProductRepository extends ProductRepository {
    productListChange$: Subject<List<Product>> = new Subject();

    constructor (private http: Http) {
        super();
    }

    simpleFindAll (): Observable<List<Product>> {
        return this.http.get('https://shining-torch-4509.firebaseio.com/products.json')
            .map(res => res.json())
            .map(data => Object.keys(data)
                .map(id => new Product({id, ...data[id]})))
            .map(List);
    }

    fancyFindAll (): Observable<List<Product>> {
        return this.simpleFindAll()
            .switchMap(products => Observable
                .from(products.toArray())
                .concatMap(product => Observable.of(product).delay(100)))
            .scan((list: List<Product>, product: Product) => list.concat(product), List<Product>());
    }

    add (product: Product): Observable<Product> {
        const data = {...product, id: undefined};

        const headers = new Headers({ 'Content-Type': 'application/json' });
        const observable = this.http.post('https://shining-torch-4509.firebaseio.com/products.json', data, new RequestOptions({ headers }));

        return observable
            .map(res => res.json())
            .map(data1 => new Product(data1))
            .do(() => this.emitNewProductList());
    }

    private emitNewProductList (): void {
        this.simpleFindAll().subscribe(this.productListChange$);
    }
}
