const { mkReqRes } = require('./utils/http');

const {
    getAllStock,
    createStock,
    softDeleteStock,
    getAllDataStock,
    updateStockById,
    decreaseStockById,
} = require('../controllers/stockController');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});

describe('Stock controllers', () => {
    describe('getAllStock', () => {
        test('200 + renvoie un tableau', (done) => {
            const rows = [
                { id: 1, product_id: 10, quantity: 5, product_name: 'Tomates' },
                { id: 2, product_id: 11, quantity: 2, product_name: 'Pommes' },
            ];
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/stock', dbResult: rows });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(Array.isArray(data)).toBe(true);
                expect(data.length).toBe(2);
                done();
            });
            getAllStock(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({ method: 'GET', url: '/api/stock', dbErr: new Error('fail') });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getAllStock(req, res);
        });
    });

    describe('createStock', () => {
        test('201 quand body valide', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/stock',
                body: { product_id: 10, quantity: 7, promo: 0 },
                dbResult: { insertId: 123 },
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(201);
                const data = res._getJSONData();
                expect(data).toEqual({ message: 'Stock ajouté avec succès' });
                done();
            });
            createStock(req, res);
        });

        test('400 quand product_id ou quantity manquant', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/stock',
                body: { product_id: 10 },
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                expect(res._getJSONData()).toHaveProperty('error');
                done();
            });
            createStock(req, res);
        });

        test('500 quand erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/stock',
                body: { product_id: 10, quantity: 7, promo: 0 },
                dbErr: new Error('db'),
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            createStock(req, res);
        });
    });

    describe('softDeleteStock', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/stock/9',
                params: { id: 9 },
                dbResult: { affectedRows: 1 },
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'Stock marqué comme supprimé' });
                done();
            });
            softDeleteStock(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'DELETE',
                url: '/api/stock/9',
                params: { id: 9 },
                dbErr: new Error('down'),
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            softDeleteStock(req, res);
        });
    });

    describe('getAllDataStock', () => {
        test('200 + renvoie un tableau', (done) => {
            const rows = [
                { id: 1, product_id: 10, product_name: 'Tomates' },
                { id: 2, product_id: 11, product_name: 'Pommes' },
            ];
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/stock/all_data',
                dbResult: rows,
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(Array.isArray(data)).toBe(true);
                expect(data.length).toBe(2);
                done();
            });
            getAllDataStock(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/stock/all_data',
                dbErr: new Error('fail'),
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            getAllDataStock(req, res);
        });
    });

    describe('updateStockById', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'PUT',
                url: '/api/stock/update/12',
                params: { id: 12 },
                body: { quantity: 15, promo: 1.5 },
                dbResult: { affectedRows: 1 },
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'Stock mis à jour' });
                done();
            });
            updateStockById(req, res);
        });

        test('400 si quantity manquant', (done) => {
            const { req, res } = mkReqRes({
                method: 'PUT',
                url: '/api/stock/update/12',
                params: { id: 12 },
                body: { promo: 1.5 },
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                expect(res._getJSONData()).toHaveProperty('error');
                done();
            });
            updateStockById(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'PUT',
                url: '/api/stock/update/12',
                params: { id: 12 },
                body: { quantity: 15, promo: 1.5 },
                dbErr: new Error('db'),
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            updateStockById(req, res);
        });
    });

    describe('decreaseStockById', () => {
        test('200 si décrément OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/stock/decrease/5',
                params: { id: 5 },
                body: { quantityToSubtract: 2 },
                dbResult: { affectedRows: 1 },
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual({ message: 'Stock diminué avec succès' });
                done();
            });
            decreaseStockById(req, res);
        });

        test('400 si stock insuffisant ou produit non trouvé (affectedRows=0)', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/stock/decrease/5',
                params: { id: 5 },
                body: { quantityToSubtract: 100 },
                dbResult: { affectedRows: 0 },
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                expect(res._getJSONData()).toHaveProperty('error');
                done();
            });
            decreaseStockById(req, res);
        });

        test('400 si quantityToSubtract manquant', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/stock/decrease/5',
                params: { id: 5 },
                body: {},
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                done();
            });
            decreaseStockById(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/stock/decrease/5',
                params: { id: 5 },
                body: { quantityToSubtract: 2 },
                dbErr: new Error('down'),
            });
            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });
            decreaseStockById(req, res);
        });
    });
});
