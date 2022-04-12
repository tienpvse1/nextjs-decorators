<h1 align="center">Welcome to nextjs-decorators 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/nextjs-decorators" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/nextjs-decorators.svg">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D10-blue.svg" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/tienpvse" target="_blank">
    <img alt="Twitter: tienpvse" src="https://img.shields.io/twitter/follow/tienpvse.svg?style=social" />
  </a>
</p>

> a simple and lightweight collection of decorators to create APIs in an elegant way in DI pattern

## Prerequisites

- node >=10

## Install

```sh
npm i nextjs-decorators
```

## Usage

Step 1: Define a controller with @Controller decorator

```ts
//  pages/api/hello.ts

import { Controller } from 'nextjs-decorators'

@Controller('api/hello') // <--this should match with the route's url generated by Next.js
class MyAwesomeController {

}
```

Step 2: Defined a route with @{Method} decorator

```ts
//  pages/api/hello.ts

import { Controller, Get, Post, Param, Body } from 'nextjs-decorators'

@Controller('api/hello')                    
class MyAwesomeController {

    @Get(':id')                               // <-- this will match with route GET api/hello/{id}
    findById(@Param('id')id:string){          // <-- get the param from url
      return someDatabaseClient.findById(id)  // <-- Promise will be automatically resolved
    }
  
    @Post('')                              // <-- this will match with route POST api/hello
    findById(@Body()body: BodyInterface){     // <-- get the body from request       
      return someDatabaseClient.create(body)  // <-- Promise will be automatically resolved
    }

}
```

Step 3: Register the controller

```ts
  //  pages/api/hello
  import { Controller, Get, Post, Param, Body, registerController } from 'nextjs-decorators'

  @Controller('api/hello')                    
  class MyAwesomeController {

      @Get(':id')                               
      findById(@Param('id')id:string){          
        return someDatabaseClient.findById(id)  
      }
  
      @Post('')                               
      findById(@Body()body: BodyInterface){    
        return someDatabaseClient.create(body)  
      }

  }

  export default registerController(MyAwesomeController)  //  <--- all routes will be registered  

```

Dependency Injection(DI)
```ts
  // page/api/service.ts
  export class MyService{

      sayHello(){
        return { message: "you are awesome" }
      }    

  }


  // page/api/hello.ts
  import { Get, Controller, AutoInject, registerController } from 'nextjs-decorators' 
  import { MyService } from './service.ts';

  @AutoInject()             // <-- automatically inject list of dependencies in constructor
  @Controller('/api/hello')
  class MyAwesomeController{

      constructor(private service: MyService){}

      @Get()
      getMessage(){
        return this.service.sayHello()
      }

  }

  export default registerController(MyAwesomeController)

```



## Author

👤 **tienpvse(Phan Van Tien)**

- Twitter: [@tienpvse](https://twitter.com/tienpvse)
- Github: [@tienpvse1](https://github.com/tienpvse1)
- LinkedIn: [@tienpvse](https://linkedin.com/in/tienpvse)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_