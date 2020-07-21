# Micro-service Boilerplate
This is a micro-service boilerplate written with Typescript and implemented using [Node.js] (Express), [MongoDB] (Mongoose), [Redis], Jest, Socket.io and OpenAPI (Swagger). You can use it to initiate your own server-side application.


## [Name of the application] API
Your can write your complete description about this app here...


### Prerequisites / Setting up for first time
What you need to install before running this app
ex: Make sure you have git, nvm, npm, [Node.js] installed


### Get the project and install npms
- Clone the project `git clone https://github.com/amin4193/typescript-boilerplate.git`
- Go to the project folder and run: `npm i`


### Database Setup
- Install [MongoDB] and [Redis] in your system and set necessary configurations.
- Do not forget to check your environment settings in `.env`


### Run Application
First you need to install [typescript] globally and compile typescript codes into javascript by:

```
npm i -g typescript

npm run build
```

This will create a `dist` folder and put all compiled .js files in there. You can change and set your own configurations by modifying `tsconfig.json` file.

Finally, you can start the project by:

```
node dist/server.js
```
or
```
npm start
```

You can also install [nodemon] globally in your system and simply use code below:
```
npm i -g nodemon

nodemon
```


#### Note1:
For security reasons, you should put "sslCert" folder into `.gitignore` file in production mode.


#### Note2:
If you want to directly run `server.ts` file, you can do this change in `package.json`:

```
...
"scripts": {
  ...
  "start": "nodemon --watch '*.ts' --exec 'ts-node' src/server.ts",
  ...
}
```

and then run: `nodemon`



### Test Application
For test we used Jest for functional testing and unit testing. you can write your own tests in `__test__` folder by creating new `your_entity.test.js` and then just run:

```
npm run test
```

#### Note: After development and test, you should put the following script in `.gitignore` file to prevent pushing tests files in production mode repositories:

```
# test folder
__tests__
```


### Docker and Deployment
You can simply set your own configs in `docker-compose.yml` file and run:
```
sudo docker-compose up -d
```


#### References
[Node.js]: https://nodejs.org/en/download/
[MongoDB]: https://docs.mongodb.com/manual/installation
[Redis]: https://redis.io/download
[nodemon]: https://www.npmjs.com/package/nodemon
[typescript]: https://www.npmjs.com/package/typescript
