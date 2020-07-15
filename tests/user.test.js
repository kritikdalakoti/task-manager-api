const request=require('supertest')
const app=require('../src/app')

test('should sign up a new user',async()=>{
    await  request(app).post('/users').send({
        name:"kritik",
        email:"ditik@gmail.com",
        password:"suruchi1"
    }).expect(201)
})