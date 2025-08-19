const httpMocks = require('node-mocks-http');
const {
    addNews,
    getAllNews,
    addImageUrlToNews,
    softDeleteNews
} = require('../controllers/newsController');

function mkReqRes({ method='POST', url='/', body={}, params={}, dbResult=null, dbErr=null }) {
    const req = httpMocks.createRequest({ method, url, body, params });
    const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });

    req.db = {
        query: jest.fn((sql, values, cb) => {
            if (typeof values === 'function') {
                cb = values;
            }
            cb(dbErr, dbResult);
        })
    };

    return { req, res };
}

describe('News controllers', () => {
    describe('addNews', () => {
        test('201 quand title + text valides', (done) => {
            const { req, res } = mkReqRes({
                body: { title: 'Nouvelle MAJ', text: 'Voici le texte' },
                dbResult: { insertId: 42 }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(201);
                const data = res._getJSONData();
                expect(data).toEqual({ message: 'News ajouté', insertId: 42 });
                done();
            });

            addNews(req, res);
        });

        test('400 quand il manque un champ (title ou text)', (done) => {
            const { req, res } = mkReqRes({
                body: { title: 'Sans texte' }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                const data = res._getJSONData();
                expect(data).toHaveProperty('error');
                done();
            });

            addNews(req, res);
        });

        test('500 quand la DB renvoie une erreur', (done) => {
            const { req, res } = mkReqRes({
                body: { title: 'T', text: 'X' },
                dbErr: new Error('MySQL error')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                const data = res._getJSONData();
                expect(data).toHaveProperty('error');
                done();
            });

            addNews(req, res);
        });
    });

    describe('getAllNews', () => {
        test('200 + agrège les images par news', (done) => {
            const rows = [
                { id: 2, created_at: '2025-08-13', title: 'B', text: 'b', image_url: 'img2a' },
                { id: 2, created_at: '2025-08-13', title: 'B', text: 'b', image_url: 'img2b' },
                { id: 1, created_at: '2025-08-12', title: 'A', text: 'a', image_url: null },
            ];

            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/news',
                dbResult: rows
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();

                expect(data.map(n => n.id)).toEqual([2,1]);
                expect(data[0]).toMatchObject({
                    id: 2,
                    title: 'B',
                    images: ['img2a','img2b']
                });
                expect(data[1]).toMatchObject({
                    id: 1,
                    title: 'A',
                    images: []
                });
                done();
            });

            getAllNews(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'GET',
                url: '/api/news',
                dbErr: new Error('fail')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });

            getAllNews(req, res);
        });
    });

    describe('addImageUrlToNews', () => {
        test('400 si imageUrl manquant', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/news/image/5',
                params: { id: 5 },
                body: {}
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(400);
                const data = res._getJSONData();
                expect(data).toHaveProperty('error');
                done();
            });

            addImageUrlToNews(req, res);
        });

        test('201 si ok', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/news/image/5',
                params: { id: 5 },
                body: { imageUrl: 'https://exemple.com/image.jpg' },
                dbResult: { affectedRows: 1 }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(201);
                const data = res._getJSONData();
                expect(data).toMatchObject({
                    message: 'Image ajoutée avec succès',
                    imageUrl: 'https://exemple.com/image.jpg'
                });
                done();
            });

            addImageUrlToNews(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'POST',
                url: '/api/news/image/5',
                params: { id: 5 },
                body: { imageUrl: 'x' },
                dbErr: new Error('db')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });

            addImageUrlToNews(req, res);
        });
    });

    describe('softDeleteNews', () => {
        test('200 si update OK', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/news/delete/7',
                params: { id: 7 },
                dbResult: { affectedRows: 1 }
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(200);
                const data = res._getJSONData();
                expect(data).toEqual({ message: 'News deleted' });
                done();
            });

            softDeleteNews(req, res);
        });

        test('500 si erreur DB', (done) => {
            const { req, res } = mkReqRes({
                method: 'PATCH',
                url: '/api/news/delete/7',
                params: { id: 7 },
                dbErr: new Error('db down')
            });

            res.on('end', () => {
                expect(res.statusCode).toBe(500);
                done();
            });

            softDeleteNews(req, res);
        });
    });
});
