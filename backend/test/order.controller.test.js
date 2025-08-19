const { mkReqRes } = require('./utils/http');

const {
    createOrder,
    softDeleteOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId
} = require('../controllers/orderController');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});

describe('Order controllers', () => {
    describe('createOrder', () => {
        test('201 quand user_id fourni', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/order/create',
                body: { user_id: 1 },
                dbResult: { insertId: 123 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(201);
                const data = res._getJSONData();
                expect(data).toEqual({ message: 'Order created successfully', id: 123 });
                done();
            });
            createOrder(req, res);
        });

        test('400 quand user_id manquant', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/order/create',
                body: {}
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                expect(res._getJSONData()).toHaveProperty('error');
                done();
            });
            createOrder(req, res);
        });

        test('500 quand la DB renvoie une erreur', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/order/create',
                body: { user_id: 1 },
                dbErr: new Error('db fail')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                expect(res._getJSONData()).toHaveProperty('error');
                done();
            });
            createOrder(req, res);
        });
    });

    describe('softDeleteOrder', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/order/7',
                params: { id: 7 },
                dbResult: { affectedRows: 1 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'Order soft deleted successfully' });
                done();
            });
            softDeleteOrder(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/order/7',
                params: { id: 7 },
                dbErr: new Error('db down')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            softDeleteOrder(req, res);
        });
    });

    describe('getAllOrders', () => {
        test('200 + renvoie un tableau', (done) => {
            const rows = [
                { id: 1, user_id: 1, deleted: 0 },
                { id: 2, user_id: 2, deleted: 0 },
            ];
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/order',
                dbResult: rows
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(Array.isArray(data)).toBe(true);
                expect(data.length).toBe(2);
                done();
            });
            getAllOrders(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/order',
                dbErr: new Error('fail')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getAllOrders(req, res);
        });
    });

    describe('getOrderById', () => {
        test('200 si trouvé', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/order/10',
                params: { id: 10 },
                dbResult: [{ id: 10, user_id: 1, deleted: 0 }]
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(data).toMatchObject({ id: 10, user_id: 1 });
                done();
            });
            getOrderById(req, res);
        });

        test('404 si vide', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/order/99',
                params: { id: 99 },
                dbResult: []
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(404);
                expect(res._getJSONData()).toHaveProperty('message', 'Order not found');
                done();
            });
            getOrderById(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/order/10',
                params: { id: 10 },
                dbErr: new Error('boom')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getOrderById(req, res);
        });
    });

    describe('getOrdersByUserId', () => {
        test('200 + renvoie un tableau', (done) => {
            const rows = [{ id: 1, user_id: 3 }, { id: 2, user_id: 3 }];
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/order/user/3',
                params: { user_id: 3 },
                dbResult: rows
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(Array.isArray(data)).toBe(true);
                expect(data.every(o => o.user_id === 3)).toBe(true);
                done();
            });
            getOrdersByUserId(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/order/user/3',
                params: { user_id: 3 },
                dbErr: new Error('err')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getOrdersByUserId(req, res);
        });
    });
});
