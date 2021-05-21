const request= require("supertest")
const app = require("../src/app")
const User = require("../src/models/user")
const jwt  = require("jsonwebtoken")
const mongoose  = require('mongoose')


const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'canaan',
    email: 'ken@me.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, `${process.env.JWT_SECRET}`)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})



test("Should signup a user", async () => {
   const  response = await request(app)
    .post("/users")
    .send({
        name: "canaan",
        email : "canaanaa@me.com",
        password: "@supaKicka11"
    })
    .expect(201)

    const user = User.findById(response.body.user._id)
    expect(user).not.toBeNull()
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisisnotmypass'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticate user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})


test("Should send1 an image", async ()=> {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', './fixtures/coverArt.jpg')
    .expect(200)

})
//! has a weird error so i moved in here to compare later
// const userAId = new mongoose.Types.ObjectId()
// const userA={
//     _id:userAId,
//     name:"canaan",
//     password:"supaKicka!@",
//     email:"canaan@dme.com",
//     tokens:[{
//         token: jwt.sign({ _id: userAId}, `${process.env.JWT_SECERT}`)
//     }]
    
// }