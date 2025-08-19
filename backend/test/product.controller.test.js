const { mkReqRes } = require('./utils/http');

const {
    addProduct,
    getAllProducts,
    softDeleteProduct,
    updateProductById
} = require('../controllers/productController');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});

describe('Product controllers', () => {
    describe('addProduct', () => {
        test('201 quand body valide', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/products',
                body: {
                    name: 'Tomates',
                    description: 'Tomates fraîches bio',
                    unit: 'kg',
                    price: 3.5,
                    included_in_subscription: false,
                    image_url: 'http://exemple.com/tomates.jpg',
                    promo: 0
                },
                dbResult: { insertId: 555 }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(201);
                expect(res._getJSONData()).toEqual({
                    message: 'Produit ajouté',
                    productId: 555
                });
                done();
            });

            addProduct(req, res);
        });

        test('400 quand champ requis manquant', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/products',
                body: {
                    unit: 'kg',
                    included_in_subscription: true
                }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                expect(res._getJSONData()).toHaveProperty('error');
                done();
            });

            addProduct(req, res);
        });

        test('500 quand la DB renvoie une erreur', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/products',
                body: {
                    name: 'Tomates',
                    description: 'Bio',
                    unit: 'kg',
                    price: 3.5,
                    included_in_subscription: false,
                    image_url: 'http://exemple.com/tomates.jpg',
                    promo: 0
                },
                dbErr: new Error('db fail')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                expect(res._getJSONData()).toHaveProperty('error');
                done();
            });

            addProduct(req, res);
        });
    });

    describe('getAllProducts', () => {
        test('200 + renvoie un tableau', (done) => {
            const rows = [
                { id: 1, name: 'A', deleted: 0 },
                { id: 2, name: 'B', deleted: 0 }
            ];
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/products',
                dbResult: rows
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(Array.isArray(data)).toBe(true);
                expect(data.length).toBe(2);
                done();
            });

            getAllProducts(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/products',
                dbErr: new Error('fail')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });

            getAllProducts(req, res);
        });
    });

    describe('softDeleteProduct', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/products/9',
                params: { id: 9 },
                dbResult: { affectedRows: 1 }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'Produit marqué comme supprimé' });
                done();
            });

            softDeleteProduct(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/products/9',
                params: { id: 9 },
                dbErr: new Error('db down')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });

            softDeleteProduct(req, res);
        });
    });

    describe('updateProductById', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'PUT',
                url: '/api/products/update/12',
                params: { id: 12 },
                body: {
                    name: 'Tomates modifiées',
                    description: 'Desc mise à jour',
                    price: 4.0,
                    included_in_subscription: true
                },
                dbResult: { affectedRows: 1 }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'Produit mis à jour' });
                done();
            });

            updateProductById(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'PUT',
                url: '/api/products/update/12',
                params: { id: 12 },
                body: {
                    name: 'X',
                    description: 'Y',
                    price: 1.0,
                    included_in_subscription: false
                },
                dbErr: new Error('boom')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });

            updateProductById(req, res);
        });
    });
});
