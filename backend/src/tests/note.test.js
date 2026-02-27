const request = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')


let accessToken
let workspaceId

beforeAll(async () =>{
    await mongoose.connect(process.env.MONGO_URI_TEST)

    const res = await request(app)
        .post('/api/users/register')
        .send({ username: 'testuser', email: 'workspace@test.com', password: '12345678' })
    accessToken = res.body.data.accessToken

    const workspace = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Test Workspace' })
    workspaceId = workspace.body.data.workspace._id
})

afterAll(async () =>{
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
})


describe('Note — Create' , () => {
    it('should create note successfully', async () => {
        const res = await request(app)
            .post(`/api/notes/${workspaceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'Test Note', content: 'Hello World' })
        expect(res.status).toBe(201)
        expect(res.body.data.note.title).toBe('Test Note')
    })
    it('should fail without token', async () => {
        const res = await request(app)
            .post(`/api/notes/${workspaceId}`)
            .send({ title: 'Test Note', content: 'Hello World' })

        expect(res.status).toBe(401)
    })
    it('should fail with empty name', async () => {
        const res = await request(app)
            .post(`/api/notes/${workspaceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({})

        expect(res.status).toBe(400)
    })
})


describe('Note - get', () =>{
    it('should get note successfully', async () =>{
        const res = await request(app)
            .get(`/api/notes/${workspaceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
        expect(res.status).toBe(200)
    })
    it('should fail without token', async () =>{
        const res = await request(app)
            .get(`/api/notes/${workspaceId}`)
        expect(res.status).toBe(401)
    })
})


describe('Note - Update', () =>{
    let noteId
    let anotherUserToken
    beforeAll(async () =>{
        const note = await request(app)
            .post(`/api/notes/${workspaceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'Note To Update', content: 'Old Content' })
        noteId = note.body.data.note._id
        const res = await request(app)
            .post('/api/users/register')
            .send({ username: 'another', email: 'another@test.com', password: '12345678' })
        anotherUserToken = res.body.data.accessToken
    })
    it('should update successfully', async () => {
        const res = await request(app)
            .patch(`/api/notes/${workspaceId}/notes/${noteId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'Updated Title' })
        expect(res.status).toBe(200)
    })
    it('should fail without token', async () => {
        const res = await request(app)
            .patch(`/api/notes/${workspaceId}/notes/${noteId}`)
            .send({ title: 'Updated Title' })
        expect(res.status).toBe(401)
    })
    it('should fail if not creator', async () => {
        const res = await request(app)
            .patch(`/api/notes/${workspaceId}/notes/${noteId}`)
            .set('Authorization', `Bearer ${anotherUserToken}`)
            .send({ title: 'Hacked Title' })
        expect(res.status).toBe(403)
    })
})


describe('Note - Delete', () =>{
    let noteId
    let anotherUserToken
    beforeAll(async () =>{
        const note = await request(app)
            .post(`/api/notes/${workspaceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'Note To Delete', content: 'Old Content' })
        noteId = note.body.data.note._id
        const res = await request(app)
            .post('/api/users/register')
            .send({ username: 'another2', email: 'another2@test.com', password: '12345678' })
        anotherUserToken = res.body.data.accessToken
    })
    it('should fail if not creator', async () => {
        const res = await request(app)
            .delete(`/api/notes/${workspaceId}/notes/${noteId}`)
            .set('Authorization', `Bearer ${anotherUserToken}`)
        expect(res.status).toBe(403)
    })
    it('should Delete successfully', async () => {
        const res = await request(app)
            .delete(`/api/notes/${workspaceId}/notes/${noteId}`)
            .set('Authorization', `Bearer ${accessToken}`)
        expect(res.status).toBe(204)
    })
    it('should fail without token', async () => {
        const res = await request(app)
            .delete(`/api/notes/${workspaceId}/notes/${noteId}`)
        expect(res.status).toBe(401)
    })
})