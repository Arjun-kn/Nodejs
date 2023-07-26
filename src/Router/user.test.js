let request = require('supertest')
let User = require('../model/userschema')
let app = require('../server')
let bcrypt = require('bcrypt')

describe('we are test user and its api', () => {
//     beforeEach(async() => {
//         await User.deleteMany({});
//     });

  test('To check User Post request',async()=>{
    const userdata = {
        name:"Arjun chauhan",
        email:"anju@gmail.com",
        password:"1234"

    }

// mock db
jest.spyOn(User.prototype, 'save').mockResolvedValueOnce(
    {
        name: 'Arjun chauhan',
          email: 'anju@gmail.com',
          password: '$2b$10$rAS9zT.gcfcb1gL1p1PX2uS7lcwBNnIFO0T2vWKEk2.B46RKmkuo6',
          _id: '64b903389c720c16bd84d329',
          __v: 0
    });

   

    const response =  await request(app).post('/user/register').send(userdata).expect(200);
    console.log(response)
    const resbody = response._body
    expect(resbody.message).toBe('User data posted successfully')
    expect(resbody.data.name).toBe('Arjun chauhan')


  })  

  test('To check error for failed API', async ()=>{
    jest.spyOn(User.prototype, 'save'). mockRejectedValueOnce(new Error('Failed to create user'));
    const userdata = {
        name:"Arjun chauhan",
        email:"anju@gmail.com",
        password:"1234"

    }
    const response = await request(app).post('/user/register').send(userdata).expect(401)
    console.log(response)
    let resbody = response._body
    expect(resbody.message).toBe('Failed to register user')
    // // expect(response.text).toBe("Unauthorized")
  })

  test('to check encrypted passsword in register api', async()=>{
    jest.spyOn(bcrypt, 'hash'). mockRejectedValueOnce(new Error('Failed to create user'));

    const userdata = {
      name:"Arjun chauhan",
      email:"anju@gmail.com",
      password:"1234"

  }
let response = await request(app).post('/user/register').send(userdata).expect(500)
console.log(response)
expect(response._body).toBe('Internal server error')

  })
 
});


describe("To check login api ", ()=>{

  
  test("to check to login api", async()=>{
    const userdata = {
      name:"Arjun chauhan",
      email:"arjun@gmail.com",
     

    }
    jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('failed'));
    let response = await request(app).post('/user/login').send(userdata).expect(500)
    console.log(response)

  })

  test("to check if user is passing null values in login",async()=>{
    const userdata = {
      name:"Arjun chauhan",
      email:"arjun@gmail.com",
     

    }

    jest.spyOn(User , "findOne").mockResolvedValueOnce(null)

    const response = await request(app).post('/user/login').send(userdata).expect(404)
    console.log(response)
    expect(response._body.message).toBe('Invalid email or password')

  })


  test("to check user is authenticate or not", async()=>{
    userdata = {
      email:'arjun@gmail.com',
      password:'1234'
    }
    
    jest.spyOn(User, 'findOne').mockResolvedValue({});
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)

    const response = await request(app).post('/user/login').send(userdata).expect(200)

    console.log(response)
    // expect(User.findOne).toHaveBeenCalled();
    // expect(bcrypt.compare).toHaveBeenCalled();

  })


  test("to check user is  unauthorized", async()=>{
    userdata = {
      email:'arjun@gmail.com',
      password:'1234'
    }
    
    jest.spyOn(User, 'findOne').mockResolvedValue({});
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)

    const response = await request(app).post('/user/login').send(userdata).expect(403)
    console.log(response)
    // expect(User.findOne).toHaveBeenCalled();
    // expect(bcrypt.compare).toHaveBeenCalled();

  })


  test("to check catch block", async()=>{
    userdata = {
      email:'arjun@gmail.com',
      password:'1234'
    }
    jest.spyOn(User, 'findOne').mockResolvedValue({});
    // jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)

    const response = await request(app).post('/user/login').send(userdata).expect(500)

    console.log(response)
    // expect(User.findOne).toHaveBeenCalled();
    // expect(bcrypt.compare).toHaveBeenCalled();

  })


})
