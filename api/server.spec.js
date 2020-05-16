const request = require('supertest')
const server = require('./server.js')
const db = require('../database/dbConfig.js')

describe('auth-router', () => {
    beforeEach(async () => {
        await db('users').truncate()
    })
    

    describe('POST /api/auth/register', () => {
        it('should return status 201', async () => {
            const post = {
                username: 'Ash',
                password: 'pass'
            }

            const response = await request(server).post('/api/auth/register').send(post)
            expect(response.status).toBe(201) 
        })

        it('should return json', async () => {
            const post = {
                username: 'Ash',
                password: 'pass'
            }

            const response = await request(server).post('/api/auth/register').send(post)
            expect(response.type).toBe('application/json') 
        })
    })




    describe('POST api/auth/login', () => {
        it('should return status 200 if successful', async () => {
          const post = {
              username: 'Ash',
              password: 'pass'
          }
  
          await request(server).post('/api/auth/register').send(post)
  
          const response = await request(server).post('/api/auth/login').send(post)
          expect(response.status).toBe(200) 
        })
  
        it('should return a token if successful', async () => {
          const post = {
              username: 'Ash',
              password: 'pass'
          }
  
  
          await request(server).post('/api/auth/register').send(post)
  
          const response = await request(server).post('/api/auth/login').send(post)
          expect(response.body.token).toBeDefined() 
         
        })
  
        it('should greet client if successful: Welcome {username}!', async () => {
          const post = {
              username: 'Ash',
              password: 'pass'
          }
  
  
          await request(server).post('/api/auth/register').send(post)
  
          const response = await request(server).post('/api/auth/login').send(post)
          expect(response.body.message).toBe('Welcome Ash!')
        })
      })
})

describe('Jokes Router', () => {
    beforeEach(async () => {
        await db('users').truncate()
    })

    describe('GET /api/jokes', () => {
        it('should return 200 if successfull', async () => {
            const post = {
                username: 'Ash',
                password: 'pass'
            }

            const posting = await request(server).post('/api/auth/register').send(post)

            const loger = await request(server).post('/api/auth/login').send(post)
            
            .then(response => {
                // console.log(response.text)
                const {token} = JSON.parse(response.text)
                console.log(token)
                return token;
            })
            .then(async token => {
                console.log(token)
                const serverResponse = await request(server).get('/api/jokes').set('authorization', token)
                // console.log(serverResponse)
                return serverResponse
            })
            .then(response => {
                expect(response.status).toBe(200)
            }) 

            // const response = request(server).get('/api/jokes').auth('Ash', 'pass').set('authorization', loger.body.token).expect('Content-Type', /json/)
        })


        it('should return JSON', async () => {
            const post = {
                username: 'Ash',
                password: 'pass'
            }

            const posting = await request(server).post('/api/auth/register').send(post)

            const loger = await request(server).post('/api/auth/login').send(post)
            
            .then(response => {
                // console.log(response.text)
                const {token} = JSON.parse(response.text)
                console.log(token)
                return token;
            })
            .then(async token => {
                const serverResponse = await request(server).get('/api/jokes').set('authorization', token)
                return serverResponse
            })
            .then(response => {
                expect(response.type).toBe('application/json')
            }) 
        })


        it('status 400 if request has no authorization header', async () => {
            const response = await request(server).get('/api/jokes')
            expect(response.status).toBe(400)
        });


        it('You do not have a token message if no token', async () => {
            const response = await request(server).get('/api/jokes')
            expect(response.body.message).toBe('You do not have a TOKEN')
        });
    })
})