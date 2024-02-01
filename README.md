## Installation

Setup mysql server and phpmyadmin containers
```
cp config.example config
```

```
./docker-setup.sh
```

### Server

#### Install npm package and setup env file

```sh
cd server/
npm install
cp .env.example .env
```

#### Run Migrations

```
npm run dev-migrate
```

### Client

```sh
cd client/
npm install
```

### Start server and client
```sh
cd server/
npm run dev

cd client/
npx vite
```
