const { mkReqRes } = require('./utils/http');

const {
    createOrderItem,
    softDeleteOrderItem,
    getAllOrderItems,
    getOrderItemsByOrderId,
} = require('../controllers/orderItemController');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});

describe('Order Item controllers', () => {
    describe('createOrderItem', () => {
        test('201 quand body valide (promo par défaut)', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/order-item/create',
                body: {
                    order_id: 1,
                    product_id: 5,
                    quantity: 3,
                    price: 10.99,
                    included_in_subscription: false
                },
                dbResult: { insertId: 777 }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(201);
                const data = res._getJSONData();
                expect(data).toEqual({ message: 'Order item created successfully', id: 777 });
                done();
            });

            createOrderItem(req, res);
        });

        test('201 quand body valide (promo fourni)', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/order-item/create',
                body: {
                    order_id: 1,
                    product_id: 5,
                    quantity: 2,
                    promo: 1.5,
                    price: 8.5,
                    included_in_subscription: true
                },
                dbResult: { insertId: 778 }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(201);
                expect(res._getJSONData().id).toBe(778);
                done();
            });

            createOrderItem(req, res);
        });

        test('400 quand champ requis manquant', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/order-item/create',
                body: {
                    order_id: 1
                }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                expect(res._getJSONData()).toHaveProperty('error');
                done();
            });

            createOrderItem(req, res);
        });

        test('500 quand la DB renvoie une erreur', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/order-item/create',
                body: {
                    order_id: 1,
                    product_id: 5,
                    quantity: 3,
                    price: 10.99,
                    included_in_subscription: false
                },
                dbErr: new Error('db fail')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                expect(res._getJSONData()).toHaveProperty('error');
                done();
            });

            createOrderItem(req, res);
        });
    });

    describe('softDeleteOrderItem', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/order-item/9',
                params: { id: 9 },
                dbResult: { affectedRows: 1 }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'Order item soft deleted successfully' });
                done();
            });

            softDeleteOrderItem(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/order-item/9',
                params: { id: 9 },
                dbErr: new Error('db down')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });

            softDeleteOrderItem(req, res);
        });
    });

    describe('getAllOrderItems', () => {
        test('200 + renvoie un tableau', (done) => {
            const rows = [
                { id: 1, order_id: 1, product_id: 5, quantity: 1, deleted: 0 },
                { id: 2, order_id: 1, product_id: 6, quantity: 2, deleted: 0 },
            ];
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/order-item',
                dbResult: rows
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(Array.isArray(data)).toBe(true);
                expect(data.length).toBe(2);
                done();
            });

            getAllOrderItems(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/order-item',
                dbErr: new Error('fail')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });

            getAllOrderItems(req, res);
        });
    });

    describe('getOrderItemsByOrderId', () => {
        test('200 + renvoie uniquement pour order_id demandé', (done) => {
            const rows = [
                { id: 11, order_id: 3, product_id: 5, name: 'Pomme', unit: 'kg' },
                { id: 12, order_id: 3, product_id: 6, name: 'Poire', unit: 'kg' },
            ];
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/order-item/order/3',
                params: { order_id: 3 },
                dbResult: rows
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(Array.isArray(data)).toBe(true);
                expect(data.every(it => it.order_id === 3)).toBe(true);
                done();
            });

            getOrderItemsByOrderId(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/order-item/order/3',
                params: { order_id: 3 },
                dbErr: new Error('err')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });

            getOrderItemsByOrderId(req, res);
        });
    });
});
