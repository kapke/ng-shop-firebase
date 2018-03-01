import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { List } from 'immutable';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from 'angularfire2/database';
import { map, tap, mapTo, take, mergeMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { Product } from './Product';
import { DocumentSnapshot } from '@firebase/firestore-types';


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
            .pipe(
                map(res => res.json()),
                map(data => Object.keys(data).map(id => new Product({id, ...data[id]}))),
                map(List),
            );
    }

    add (product: Product): Observable<Product> {
        const data = {...product, id: undefined};

        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.post(this.getUrl(), data, new RequestOptions({ headers }))
            .pipe(
                map(res => res.json()),
                map(data1 => new Product(data1)),
                tap(() => this.emitNewProductList()),
            );
    }

    delete (product: Product): Observable<void> {
        return this.http.delete(this.getUrl(product.id))
            .pipe(
                mapTo(void 0),
                tap(() => this.emitNewProductList()),
            );
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
        .pipe(
            map(data => data
                .filter(item => !!item)
                .map(item => new Product({id: item!.payload!.key, ...item!.payload!.val()}))),
            map(List),
        );

    constructor(private db: AngularFireDatabase) {
        super();
    }

    getAll(): Observable<List<Product>> {
        return this.productList$.pipe(take(1));
    }

    add(product: Product): Observable<Product> {
        const data = {...product, id: undefined};

        return fromPromise(this.productList.push(product).then(reference => new Product({...data, id: reference.key || ''})));
    }

    delete(product: Product): Observable<void> {
        return fromPromise<void>(this.productList.remove(product.id));
    }
}

@Injectable()
export class FireStoreProductRepository extends ProductRepository {
    private products = this.fs.collection<Product>('products');

    public productList$ = this.products.snapshotChanges().pipe(
        map(actions => actions
            .map(a => a.payload.doc)
            .map(this.documentToProduct)
        ),
        map(List),
    );

    constructor (private fs: AngularFirestore) {
        super();
    }

    public add(product: Product): Observable<Product> {
        return fromPromise(this.products.add(product)).pipe(
            mergeMap(docRef => docRef.get()),
            map(this.documentToProduct),
        );
    }

    public delete(product: Product): Observable<void> {
        return fromPromise(this.fs.doc(`products/${product.id}`).delete());
    }

    public getAll(): Observable<List<Product>> {
        return this.productList$.pipe(take(1));
    }

    private documentToProduct = (doc: DocumentSnapshot): Product => new Product({...doc.data(), id: doc.id });
}
