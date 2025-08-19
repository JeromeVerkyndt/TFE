const { mkReqRes } = require('./utils/http');

const {
    softDeleteUser,
    getAllUsers,
    getAllClientsInformation,
    getAllClients,
    getUserById,
    updateUserById,
    subtractFromUserBalance,
    subtractFromUserExtraBalance,
    updateUserBalance,
    updateUserExtraBalance,
    updateUserSubscription,
    updateEmail,
    resetUserBalanceToSubscription,
    resetAllClientBalancesToSubscription
} = require('../controllers/userController');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});

describe('User controllers', () => {
    describe('softDeleteUser', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/user/9',
                params: { id: 9 },
                dbResult: { affectedRows: 1 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'User deleted' });
                done();
            });
            softDeleteUser(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({ method: 'DELETE', url: '/api/user/9', params: { id: 9 }, dbErr: new Error('down') });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            softDeleteUser(req, res);
        });
    });

    describe('getAllUsers', () => {
        test('200 + tableau', (done) => {
            const rows = [{ id: 1 }, { id: 2 }];
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/user', dbResult: rows });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res._getJSONData())).toBe(true);
                done();
            });
            getAllUsers(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/user', dbErr: new Error('fail') });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getAllUsers(req, res);
        });
    });

    describe('getAllClientsInformation', () => {
        test('200 + tableau', (done) => {
            const rows = [{ id: 1, subscription_price: 10 }];
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/user/clients/info', dbResult: rows });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res._getJSONData())).toBe(true);
                done();
            });
            getAllClientsInformation(req, res);
        });

        test('500 si DB erreur', (done) => {
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/user/clients/info', dbErr: new Error('db') });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getAllClientsInformation(req, res);
        });
    });

    describe('getAllClients', () => {
        test('200 + tableau', (done) => {
            const rows = [{ id: 1 }, { id: 2 }];
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/user/clients', dbResult: rows });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res._getJSONData())).toBe(true);
                done();
            });
            getAllClients(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/user/clients', dbErr: new Error('db') });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getAllClients(req, res);
        });
    });

    describe('getUserById', () => {
        test('200 si trouvé', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/user/12',
                params: { id: 12 },
                dbResult: [{ id: 12, last_name: 'X', email: 'a@b.com' }]
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toMatchObject({ id: 12 });
                done();
            });
            getUserById(req, res);
        });

        test('404 si non trouvé', (done) => {
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/user/12', params: { id: 12 }, dbResult: [] });
            res.on('end', () => {
                expect(res.statusCode).toBe(404);
                done();
            });
            getUserById(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/user/12', params: { id: 12 }, dbErr: new Error('fail') });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getUserById(req, res);
        });
    });

    describe('updateUserById', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'PUT',
                url: '/api/user/12',
                params: { id: 12 },
                body: { balance: 100, extra_balance: 5 },
                dbResult: { affectedRows: 1 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'user mis à jour' });
                done();
            });
            updateUserById(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'PUT',
                url: '/api/user/12',
                params: { id: 12 },
                body: { balance: 100, extra_balance: 5 },
                dbErr: new Error('db')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            updateUserById(req, res);
        });
    });

    describe('subtractFromUserBalance', () => {
        test('400 si montant invalide', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/1/sub/balance', params: { id: 1 }, body: { amount: -1 } });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                done();
            });
            subtractFromUserBalance(req, res);
        });

        test('500 si erreur DB au SELECT', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/1/sub/balance', params: { id: 1 }, body: { amount: 2 } });
            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(new Error('select fail')));
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            subtractFromUserBalance(req, res);
        });

        test('404 si utilisateur non trouvé', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/1/sub/balance', params: { id: 1 }, body: { amount: 2 } });
            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(null, []));
            res.on('end', () => {
                expect(res.statusCode).toBe(404);
                done();
            });
            subtractFromUserBalance(req, res);
        });

        test('500 si erreur DB à l’UPDATE', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/1/sub/balance', params: { id: 1 }, body: { amount: 2 } });
            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(null, [{ balance: 10 }]))
                .mockImplementationOnce((sql, params, cb) => cb(new Error('update fail')));
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            subtractFromUserBalance(req, res);
        });

        test('200 si succès -> renvoie newBalance', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/1/sub/balance', params: { id: 1 }, body: { amount: 2 } });
            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(null, [{ balance: 10 }]))
                .mockImplementationOnce((sql, params, cb) => cb(null, { affectedRows: 1 }));
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(data).toMatchObject({ message: 'Solde mis à jour', newBalance: 8 });
                done();
            });
            subtractFromUserBalance(req, res);
        });
    });

    describe('subtractFromUserExtraBalance', () => {
        test('400 si montant invalide', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/1/sub/extrabalance', params: { id: 1 }, body: { amount: -1 } });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                done();
            });
            subtractFromUserExtraBalance(req, res);
        });

        test('200 si succès', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/1/sub/extrabalance', params: { id: 1 }, body: { amount: 3 } });
            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(null, [{ extra_balance: 5 }]))
                .mockImplementationOnce((sql, params, cb) => cb(null, { affectedRows: 1 }));
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toMatchObject({ newBalance: 2 });
                done();
            });
            subtractFromUserExtraBalance(req, res);
        });
    });

    describe('updateUserBalance', () => {
        test('400 si montant invalide', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/1/add/balance', params: { id: 1 }, body: { amount: 'abc' } });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                done();
            });
            updateUserBalance(req, res);
        });

        test('200 si succès (addition)', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/1/add/balance', params: { id: 1 }, body: { amount: 4 } });
            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(null, [{ balance: 6 }]))
                .mockImplementationOnce((sql, params, cb) => cb(null, { affectedRows: 1 }));
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toMatchObject({ newBalance: 10 });
                done();
            });
            updateUserBalance(req, res);
        });
    });

    describe('updateUserExtraBalance', () => {
        test('400 si montant invalide', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/1/add/extrabalance', params: { id: 1 }, body: { amount: 'x' } });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                done();
            });
            updateUserExtraBalance(req, res);
        });

        test('200 si succès (addition)', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/1/add/extrabalance', params: { id: 1 }, body: { amount: 2 } });
            req.db.query = jest.fn()
                .mockImplementationOnce((sql, params, cb) => cb(null, [{ extra_balance: 3 }]))
                .mockImplementationOnce((sql, params, cb) => cb(null, { affectedRows: 1 }));
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toMatchObject({ newBalance: 5 });
                done();
            });
            updateUserExtraBalance(req, res);
        });
    });

    describe('updateUserSubscription', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/user/12/subscription',
                params: { id: 12 },
                body: { subscriptionId: 42 },
                dbResult: { affectedRows: 1 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'Abonnement mis à jour' });
                done();
            });
            updateUserSubscription(req, res);
        });

        test('404 si user non trouvé', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/user/12/subscription',
                params: { id: 12 },
                body: { subscriptionId: 42 },
                dbResult: { affectedRows: 0 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(404);
                done();
            });
            updateUserSubscription(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/user/12/subscription',
                params: { id: 12 },
                body: { subscriptionId: 42 },
                dbErr: new Error('db')
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            updateUserSubscription(req, res);
        });
    });

    describe('updateEmail', () => {
        test('400 si email manquant', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/12/email', params: { id: 12 }, body: {} });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                done();
            });
            updateEmail(req, res);
        });

        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/user/12/email',
                params: { id: 12 },
                body: { email: 'x@y.com' },
                dbResult: { affectedRows: 1 }
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toHaveProperty('message');
                done();
            });
            updateEmail(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({ method: 'PATCH', url: '/api/user/12/email', params: { id: 12 }, body: { email: 'x@y.com' }, dbErr: new Error('fail') });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            updateEmail(req, res);
        });
    });

    describe('resetUserBalanceToSubscription', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({ method: 'PUT', url: '/api/user/12/reset-balance', params: { id: 12 }, dbResult: { affectedRows: 1 } });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'Balance remise au montant de l’abonnement ou à 0' });
                done();
            });
            resetUserBalanceToSubscription(req, res);
        });

        test('404 si user non trouvé', (done) => {
            const { req, res } = mkReqRes({ method: 'PUT', url: '/api/user/12/reset-balance', params: { id: 12 }, dbResult: { affectedRows: 0 } });
            res.on('end', () => {
                expect(res.statusCode).toBe(404);
                done();
            });
            resetUserBalanceToSubscription(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({ method: 'PUT', url: '/api/user/12/reset-balance', params: { id: 12 }, dbErr: new Error('db') });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            resetUserBalanceToSubscription(req, res);
        });
    });

    describe('resetAllClientBalancesToSubscription', () => {
        test('200 + affectedRows retourné', (done) => {
            const { req, res } = mkReqRes({ method: 'PUT', url: '/api/user/all-balance/reset-subscription', dbResult: { affectedRows: 7 } });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(data).toMatchObject({
                    message: 'Balances des clients remises au montant de leur abonnement ou à 0',
                    affectedRows: 7
                });
                done();
            });
            resetAllClientBalancesToSubscription(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({ method: 'PUT', url: '/api/user/all-balance/reset-subscription', dbErr: new Error('down') });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            resetAllClientBalancesToSubscription(req, res);
        });
    });
});
