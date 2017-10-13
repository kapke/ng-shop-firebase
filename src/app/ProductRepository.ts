import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { List } from 'immutable';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from 'angularfire2/database';

import { Product } from './Product';


export abstract class ProductRepository {
    abstract productList$: Observable<List<Product>>;

    abstract getAll (): Observable<List<Product>>;
    abstract add (product: Product): Observable<Product>;
    abstract delete (product: Product): Observable<void>;
}

@Injectable()
export class HttpFireBaseProductRepository extends ProductRepository {
    productList$: Subject<List<Product>> = new Subject();

    constructor (private http: Http) {
        super();
    }

    getAll (): Observable<List<Product>> {
        return this.http.get(this.getUrl())
            .map(res => res.json())
            .map(data => Object.keys(data)
                .map(id => new Product({id, ...data[id]})))
            .map(List);
    }

    add (product: Product): Observable<Product> {
        const data = {...product, id: undefined};

        const headers = new Headers({ 'Content-Type': 'application/json' });
        const observable = this.http.post(this.getUrl(), data, new RequestOptions({ headers }));

        return observable
            .map(res => res.json())
            .map(data1 => new Product(data1))
            .do(() => this.emitNewProductList());
    }

    delete (product: Product): Observable<void> {
        return this.http.delete(this.getUrl(product.id))
            .mapTo(void 0)
            .do(() => this.emitNewProductList());
    }

    private emitNewProductList (): void {
        this.getAll().subscribe(products => this.productList$.next(products));
    }

    private getUrl (id?: string): string {
        const idPart = id ? '/' + id : '';
        return `https://shining-torch-4509.firebaseio.com/products${idPart}.json`;
    }
}

@Injectable()
export class FireBaseProductRepository extends ProductRepository {
    private productList: AngularFireList<Product> = this.db.list('products');

    productList$: Observable<List<Product>> = this.productList
        .snapshotChanges()
        .map(data => data
            .filter(item => !!item)
            .map(item => new Product({id: item!.payload!.key, ...item!.payload!.val()})))
        .map(List);

    constructor(private db: AngularFireDatabase) {
        super();
    }

    getAll(): Observable<List<Product>> {
        return this.productList$.take(1);
    }

    add(product: Product): Observable<Product> {
        const data = {...product, id: undefined};

        return Observable.fromPromise(this.productList.push(product));
    }

    delete(product: Product): Observable<void> {
        return Observable.fromPromise<void>(this.productList.remove(product.id));
    }
}
