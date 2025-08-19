const { mkReqRes } = require('./utils/http');

const {
    createSubscription,
    getAllSubscriptions,
    softDeleteSubscription,
    updateSubscriptionVisibility,
    getUserSubscriptions
} = require('../controllers/subscriptionController');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});

describe('Subscription controllers', () => {
    describe('createSubscription', () => {
        test('201 quand body valide', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/subscriptions/add',
                body: { name: 'Mensuel', description: 'Accès mensuel', price: 9.99 },
                dbResult: { insertId: 101 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(201);
                expect(res._getJSONData()).toEqual({ message: 'Abonnement créé', id: 101 });
                done();
            });
            createSubscription(req, res);
        });

        test('400 quand name ou price manquant', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/subscriptions/add',
                body: { description: 'incomplet' }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                expect(res._getJSONData()).toHaveProperty('error');
                done();
            });
            createSubscription(req, res);
        });

        test('500 quand erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/subscriptions/add',
                body: { name: 'Mensuel', price: 9.99 },
                dbErr: new Error('db fail')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            createSubscription(req, res);
        });
    });

    describe('getAllSubscriptions', () => {
        test('200 + renvoie un tableau', (done) => {
            const rows = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/subscriptions/all',
                dbResult: rows
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(Array.isArray(data)).toBe(true);
                expect(data.length).toBe(2);
                done();
            });
            getAllSubscriptions(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/subscriptions/all',
                dbErr: new Error('fail')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getAllSubscriptions(req, res);
        });
    });

    describe('softDeleteSubscription', () => {
        test('200 si affectedRows>0', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/subscriptions/9',
                params: { id: 9 },
                dbResult: { affectedRows: 1 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'Abonnement supprimé (soft delete)' });
                done();
            });
            softDeleteSubscription(req, res);
        });

        test('404 si pas trouvé (affectedRows=0)', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/subscriptions/9',
                params: { id: 9 },
                dbResult: { affectedRows: 0 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(404);
                done();
            });
            softDeleteSubscription(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/subscriptions/9',
                params: { id: 9 },
                dbErr: new Error('down')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            softDeleteSubscription(req, res);
        });
    });

    describe('updateSubscriptionVisibility', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/subscriptions/visibility/4',
                params: { id: 4 },
                body: { visible: true },
                dbResult: { affectedRows: 1 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'Visibilité mise à jour' });
                done();
            });
            updateSubscriptionVisibility(req, res);
        });

        test('404 si non trouvé/supprimé (affectedRows=0)', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/subscriptions/visibility/4',
                params: { id: 4 },
                body: { visible: false },
                dbResult: { affectedRows: 0 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(404);
                done();
            });
            updateSubscriptionVisibility(req, res);
        });

        test('400 si visible manquant', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/subscriptions/visibility/4',
                params: { id: 4 },
                body: {}
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                done();
            });
            updateSubscriptionVisibility(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/subscriptions/visibility/4',
                params: { id: 4 },
                body: { visible: true },
                dbErr: new Error('boom')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            updateSubscriptionVisibility(req, res);
        });
    });

    describe('getUserSubscriptions', () => {
        test('400 si userId manquant (query)', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/subscriptions/user',
            });
            req.query = {};
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                done();
            });
            getUserSubscriptions(req, res);
        });

        test('500 si erreur DB lors de la récupération du user', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/subscriptions/user',
            });
            req.query = { userId: 7 };

            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(new Error('user db fail')))
            ;

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });

            getUserSubscriptions(req, res);
        });

        test('404 si user non trouvé', (done) => {
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/subscriptions/user' });
            req.query = { userId: 7 };

            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(null, []))
            ;

            res.on('end', () => {
                expect(res.statusCode).toBe(404);
                done();
            });

            getUserSubscriptions(req, res);
        });

        test('200 liste visible si user.subscription_id = null', (done) => {
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/subscriptions/user' });
            req.query = { userId: 3 };

            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(null, [{ subscription_id: null }]))
                .mockImplementationOnce((sql, params, cb) => cb(null, [
                    { id: 1, visible: 1, deleted: 0 },
                    { id: 2, visible: 1, deleted: 0 },
                ]));

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(Array.isArray(data)).toBe(true);
                expect(data.length).toBe(2);
                done();
            });

            getUserSubscriptions(req, res);
        });

        test('200 détail si user.subscription_id != null', (done) => {
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/subscriptions/user' });
            req.query = { userId: 5 };

            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(null, [{ subscription_id: 42 }]))
                .mockImplementationOnce((sql, params, cb) => cb(null, [{ id: 42, visible: 1, deleted: 0 }]));

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(Array.isArray(data)).toBe(true);
                expect(data.length).toBe(1);
                expect(data[0].id).toBe(42);
                done();
            });

            getUserSubscriptions(req, res);
        });

        test('500 si erreur DB lors du 2e SELECT', (done) => {
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/subscriptions/user' });
            req.query = { userId: 8 };

            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(null, [{ subscription_id: null }]))
                .mockImplementationOnce((sql, params, cb) => cb(new Error('subs fail')));

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });

            getUserSubscriptions(req, res);
        });
    });
});
