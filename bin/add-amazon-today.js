require('isomorphic-fetch');

const path = require('path');

const fs = require('fs-extra-promise');
const Immutable = require('immutable');
const cheerio = require('cheerio');
const _ = require('lodash');
const { Observable } = require('rxjs');

const dealsFilePath = path.join(__dirname, 'deals.json');
const productsUrl = 'https://shining-torch-4509.firebaseio.com/products.json';

const mapping = Immutable.fromJS({
    price: 'maxCurrentPrice',
    name: 'title',
    imageUrl: 'primaryImage',
});

const productDefaults = {price: '', name: '', imageUrl: ''};
const Product = Immutable.Record(productDefaults, 'Product');

const product = new Product({price: '5'});
console.log(product.toJS(), typeof product.toJSON());

const doLog = (name='') => (...args) => console.log(`[${name}]`, ...args);

const dealIntoProduct = (deal) => mapping
    .keySeq()
    .reduce(
        (product, property) => product.set(property, deal.get(mapping.get(property))),
        new Product()
    );

Observable.fromPromise(fs.readJSONAsync(dealsFilePath, 'utf8'))
    .pluck('dealDetails')
    .map(data => Object
        .keys(data)
        .map(name => data[name])
        .map(d => Immutable.fromJS(d))
    )
    .switchMap(Observable.from)
    .map(dealIntoProduct)
    .map(product => JSON.stringify(product.toJS()))
    .flatMap(productJson => fetch(productsUrl, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: productJson,
    }))
    .subscribe(
        doLog('data'),
        doLog('error'),
        doLog('finish')
    );
