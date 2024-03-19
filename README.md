# Planty of Food APIs

![Static Badge](https://img.shields.io/badge/JAVASCRIPT-black?style=for-the-badge&logo=JavaScript)
![Static Badge](https://img.shields.io/badge/NODE.Js-black?style=for-the-badge&logo=Node.js)

## Description

This Node.js project recreates the JSON RESTful APIs for a hypothetical platform that manages purchasing groups for the Planty of Food company.
Being a Node.js project, it was created in JavaScript with the help of the Express framework, the use of a MongoDB database for data storage and the Mongoose library to facilitate interaction with it. For unit tests, Mocha, Chai and Sinon were used instead.

_This is an app for demonstration purposes, but for its operation it will insert data into a database. Please use dummy data._

## Installation

If you're using OS X or Windows, use one of the installers from the [Node.js download page](https://nodejs.org/en/download/). LTS versions of Node.js are recommended.

Open terminal and clone the Github repo:

```bash
git clone https://github.com/Gio-Mex/planty-of-food-api.git
```

Then, you can install NPM packages:

```bash
npm install
```

Now connect to server:

```bash
npm run serve
```

Navigate to http://localhost:3000/

If everything has been installed correctly you should see the welcome message: "Welcome to Planty of Food APIs".
(If you're a dev and you want to use Nodemon type `npm run dev`, while if you want to do tests type `npm run test`).

The APIs are already working but if you want to use a ready-made dummy server, type the command:

```bash
npm run mockDB
```

## API Usage

These APIs are designed for inserting, updating, searching and deleting product, customer and order data.

### Products

**Create a product**

- Endpoint: `/products`
- Method: `POST`
- Request Body: {name: 'product name'}

**Get all products**

- Endpoint: `/products`
- Method: `GET`

**Get a product by name**

- Endpoint: `/products/:name`
- Method: `GET`

**Update a product**

- Endpoint: `/products/:name`
- Method: `PUT`
- Request Body: {name: 'new product name'}

**Delete a product**

- Endpoint: `/products/:name`
- Method: `DELETE`

### Users

**Create a user**

- Endpoint: `/users`
- Method: `POST`
- Request Body: {name: 'name', surname: 'surname', email: 'email' }

**Get all users**

- Endpoint: `/users`
- Method: `GET`

**Get user by email**

- Endpoint: `/users/:email`
- Method: `GET`

**Update user**

- Endpoint: `/users/:email`
- Method: `PUT`
- Request Body: {name: 'name', surname: 'surname', email: 'email' }

**Delete user**

- Endpoint: `/users/:email`
- Method: `DELETE`

### Orders

**Create an order**

- Endpoint: `/orders`
- Method: `POST`
- Request Body: {
  products: [
  {name: 'product1'},
  {name:'product2'}
  ...
  ],
  users: [
  {
  name: 'user1',
  surname: 'surname1',
  email: 'email1'
  },
  {
  name: 'user2',
  surname: 'surname2',
  email: 'email2'
  }
  ...
  ],
  date: 'date'}

**Get all orders**

- Endpoint: `/orders`
- Method: `GET`

**Get an order by ID**

- Endpoint: `/orders/:id`
- Method: `GET`

**Get orders by date**

- Endpoint: `/orders/date/:date`
- Method: `GET`

**Get orders by product**

- Endpoint: `/orders/products/:name`
- Method: `GET`

**Update an order**

- Endpoint: `/orders/:id`
- Method: `PUT`
- Request Body: {
  products: [
  {name: 'product1'},
  {name:'product2'}
  ...
  ],
  users: [
  {
  name: 'user1',
  surname: 'surname1',
  email: 'email1'
  },
  {
  name: 'user2',
  surname: 'surname2',
  email: 'email2'
  }
  ...
  ],
  date: 'date'}

**Delete an order**

- Endpoint: `/orders/:id`
- Method: `DELETE`

You can test APIs using tools like Thunder Client, Postman or Insomnia.
