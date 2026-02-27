const request = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

// قبل كل الـ tests — اتصل بـ DB تجريبية
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST)
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
})

describe('Auth — Register', () => {
    it('should register successfully', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({ username: 'testuser', email: 'test@test.com', password: '12345678' })
        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
    })

    it('should fail if email already exists', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({ username: 'testuser', email: 'test@test.com', password: '12345678' })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('User Already Exist')
    })

    it('should fail with invalid data', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({ username: 'ab', email: 'notanemail', password: '123' })

        expect(res.status).toBe(400)
    })
})

describe('Auth - Login', () =>{
    it('should Login successfully', async () =>{
        const res = await request(app)
            .post('/api/users/login')
            .send({email: 'test@test.com', password: '12345678'})
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })
    it('sould if email exist', async () =>{
        const res = await request(app)
            .post('/api/users/login')
            .send({email: 'amm@test.com', password: '12345678'})
        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Invalid email or password')
    })
    it('should fail if password incorrect', async () =>{
        const res = await request(app)
            .post('/api/users/login')
            .send({email: 'test@test.com', password: '57782729'})
        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Invalid email or password')
    })

})