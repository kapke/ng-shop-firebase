// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    firebase: {
        apiKey: 'AIzaSyD_-7D87cZ-zBxW_5lxV8AM8-xca1x0cXA',
        authDomain: 'shop-firestore.firebaseapp.com',
        databaseURL: 'https://shop-firestore.firebaseio.com',
        projectId: 'shop-firestore',
        storageBucket: 'shop-firestore.appspot.com',
        messagingSenderId: '958519032806'
    }
};
