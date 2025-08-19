const { mkReqRes } = require('./utils/http');

const {
    getTransactionByUserId,
    createTransaction,
    updatePaidStatus,
    getUnpaidSubscriptions
} = require('../controllers/transactionController');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});

describe('Transaction controllers', () => {
    describe('getTransactionByUserId', () => {
        test('200 + renvoie un tableau', (done) => {
            const rows = [
                { id: 1, user_id: 7, amount: 10, type: 'Achat' },
                { id: 2, user_id: 7, amount: 5, type: 'Abonnement' }
            ];
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/transaction/user/7',
                params: { user_id: 7 },
                dbResult: rows
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(Array.isArray(data)).toBe(true);
                expect(data.length).toBe(2);
                done();
            });
            getTransactionByUserId(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/transaction/user/7',
                params: { user_id: 7 },
                dbErr: new Error('db fail')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getTransactionByUserId(req, res);
        });
    });

    describe('createTransaction', () => {
        test('201 quand body valide (avec order_id & comment optionnels)', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/transaction/create',
                body: {
                    user_id: 3,
                    amount: 12.5,
                    type: 'Achat',
                    order_id: 15,
                    comment: 'ok',
                    is_paid: true
                },
                dbResult: { insertId: 999 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(201);
                expect(res._getJSONData()).toEqual({ id: 999 });
                done();
            });
            createTransaction(req, res);
        });

        test('400 quand champs requis manquants (user_id/amount/type)', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/transaction/create',
                body: { user_id: 3, amount: 12.5 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                expect(res._getJSONData()).toHaveProperty('error');
                done();
            });
            createTransaction(req, res);
        });

        test('500 si erreur DB à l’INSERT', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/transaction/create',
                body: { user_id: 3, amount: 12.5, type: 'Achat', is_paid: false },
                dbErr: new Error('insert fail')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            createTransaction(req, res);
        });
    });

    describe('updatePaidStatus', () => {

        test('400 si is_paid manquant', (done) => {
            const { req, res } = mkReqRes({
                method: 'PUT',
                url: '/api/transaction/123/paid',
                params: { id: 123 },
                body: {}
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                done();
            });
            updatePaidStatus(req, res);
        });

        test('404 si transaction non trouvée (affectedRows=0)', (done) => {
            const { req, res } = mkReqRes({
                method: 'PUT',
                url: '/api/transaction/123/paid',
                params: { id: 123 },
                body: { is_paid: false },
                dbResult: { affectedRows: 0 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(404);
                done();
            });
            updatePaidStatus(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'PUT',
                url: '/api/transaction/123/paid',
                params: { id: 123 },
                body: { is_paid: true },
                dbErr: new Error('update fail')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            updatePaidStatus(req, res);
        });
    });

    describe('getUnpaidSubscriptions', () => {
        test('200 renvoie le nombre non payés', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/transaction/paid-subscriptions/7',
                params: { userId: 7 },
                dbResult: [{ paid_count: 3 }]
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(data).toEqual({ paidCount: 3 });
                done();
            });
            getUnpaidSubscriptions(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/transaction/paid-subscriptions/7',
                params: { userId: 7 },
                dbErr: new Error('db down')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getUnpaidSubscriptions(req, res);
        });
    });
});
