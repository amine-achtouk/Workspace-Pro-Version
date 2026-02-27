const request = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

let accessToken

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST)

   const res = await request(app)
        .post('/api/users/register')
        .send({ username: 'testuser', email: 'workspace@test.com', password: '12345678' })

    accessToken = res.body.data.accessToken
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
})

describe('Workspace — Create', () => {
    it('should create workspace successfully', async () => {
        const res = await request(app)
            .post('/api/workspaces')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'Test Workspace' })

        expect(res.status).toBe(201)
        expect(res.body.data.workspace.name).toBe('Test Workspace')
    })

    it('should fail without token', async () => {
        const res = await request(app)
            .post('/api/workspaces')
            .send({ name: 'Test Workspace' })

        expect(res.status).toBe(401)
    })

    it('should fail with empty name', async () => {
        const res = await request(app)
            .post('/api/workspaces')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({})

        expect(res.status).toBe(400)
    })
})

describe('Workspace - Get', () =>{
    it('should get workspace successfully', async () =>{
        const res = await request(app)
            .get('/api/workspaces')
            .set('Authorization', `Bearer ${accessToken}`)
        expect(res.status).toBe(200)
    })
    it('should fail without token', async () =>{
        const res = await request(app)
            .get('/api/workspaces')
        expect(res.status).toBe(401)
    })
})

describe('Workspace - Update',  () =>{
    let workspaceId
    let anotherUserToken

    beforeAll(async () =>{
        const workspace = await request(app)
            .post('/api/workspaces')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'Workspace To Update' })
        workspaceId = workspace.body.data.workspace._id

        const res = await request(app)
            .post('/api/users/register')
            .send({ username: 'another', email: 'another@test.com', password: '12345678' })
        anotherUserToken = res.body.data.accessToken
    })
    it('should update successfully', async () => {
        const res = await request(app)
            .patch(`/api/workspaces/${workspaceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'Updated Name' })
        expect(res.status).toBe(200)
    })
    it('should fail without token', async () => {
        const res = await request(app)
            .patch(`/api/workspaces/${workspaceId}`)
            .send({ name: 'Updated Name' })
        expect(res.status).toBe(401)
    })
    it('should fail if not owner', async () => {
        const res = await request(app)
            .patch(`/api/workspaces/${workspaceId}`)
            .set('Authorization', `Bearer ${anotherUserToken}`)
            .send({ name: 'Hacked Name' })
        expect(res.status).toBe(403)
    })
})

describe('Workspace - Delete',  () =>{
    let workspaceId
    let anotherUserToken
    beforeAll(async () =>{
        const workspace = await request(app)
            .post('/api/workspaces')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'Workspace To Delete' })
        workspaceId = workspace.body.data.workspace._id
    const res = await request(app)
            .post('/api/users/register')
            .send({ username: 'another2', email: 'another2@test.com', password: '12345678' })
        anotherUserToken = res.body.data.accessToken
    })
    it('should fail if not owner', async () => {
        const res = await request(app)
            .delete(`/api/workspaces/${workspaceId}`)
            .set('Authorization', `Bearer ${anotherUserToken}`)
        expect(res.status).toBe(403)
    })
    it('should delete successfully', async () => {
        const res = await request(app)
            .delete(`/api/workspaces/${workspaceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
        expect(res.status).toBe(204)
    })
    it('should fail without token', async () => {
        const res = await request(app)
            .delete(`/api/workspaces/${workspaceId}`)
        expect(res.status).toBe(401)
    })

})