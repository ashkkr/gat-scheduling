const { generateClientId } = require('./routes/client');
const request = require('supertest');
const app = require('./index');

describe('generateClientId', () => {
    var clientid;
    beforeAll(() => {
        clientid = Math.floor(Math.random() * 100);
    })

    it('should increment the clientid and return its value', () => {
        const initialClientid = clientid;
        const result = generateClientId(clientid);
        expect(result).toBe(initialClientid + 1);
    });
});

describe('login and hello test', () => {
    var jwtToken;
    beforeAll(() => {
        it('testing login', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({ email: 'ashutoshsangra@gmail.com', password: '1234' });
            jwtToken = response.body.token;
            expect(response.status).toBe(200);
            expect(response.message).toBe('Log In successfull');
        })

        it('failed login', async () => {
            const resp = await request(app)
                .post('/user/login')
                .send({ email: 'ashutoshsangra@gmail.com', password: '12345' }); //wrong password

            expect(response.status).toBe(401);
            expect(response.message).toBe('Incorrect username or password');
        })
    });

    it('should return a 200 OK response with the message "hey this also works"', async () => {
        const response = await request(app)
            .get('users/hello')
            .set('Authorization', 'Bearer ' + jwtToken);

        expect(response.status).toBe(200);
        expect(response.message).toBe('hey this also works');
    });

    it('should return a 401 Unauthorized error if no JWT token is provided', async () => {
        const response = await request(app)
            .get('/users/hello');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication failed' });
    });
});

// describe('GET /clientemail/:gst', () => {
//     let clientDetails;
//     let emailDetails;

//     beforeAll(async () => {
//         // Create a test client and email record
//         clientDetails = await ClientsModel.create({
//             name: 'Test Client',
//             gstNumber: '1234567890'
//         });
//         emailDetails = await EmailModel.create({
//             clientId: clientDetails.clientId,
//             lastEmail: ['test@example.com'],
//             nextEmail: 'test2@example.com'
//         });
//     });

//     afterAll(async () => {
//         // Delete the test client and email record
//         await ClientsModel.deleteOne({ _id: clientDetails._id });
//         await EmailModel.deleteOne({ _id: emailDetails._id });
//     });

//     it('should return the last and next email for a client with the given GST number', async () => {
//         const response = await request(app)
//             .get(`/clientemail/${clientDetails.gstNumber}`)
//             .set('Authorization', 'Bearer testtoken');

//         expect(response.status).toBe(200);
//         expect(response.body).toEqual({
//             lastEmail: 'test@example.com',
//             nextEmail: 'test2@example.com'
//         });
//     });

//     it('should return a 404 error if no client email details are found', async () => {
//         const response = await request(app)
//             .get('/clientemail/invalidgst')
//             .set('Authorization', 'Bearer testtoken');

//         expect(response.status).toBe(404);
//         expect(response.body).toEqual({ message: 'no client email details found' });
//     });
// });