# Base ExpressJS

Base ExpressJS is a basic source code, using Express FrameWork

## Requirements

-   node ~ v18.19.0
-   npm ~ v10.2.3

## Usage

1. Clone project
2. Create `.env` file, copy content from [.env.example](./.env.example) to `.env` file and config in `.env`:

-   Config Runtime Environment

```bash
# development or production
NODE_ENV=development
HOST=localhost
PORT=3456
```

-   Config Project

```bash
APP_NAME=ExpressJS
APP_DEBUG=true
# server domain name
APP_URL_API=http://localhost:3456
# primary client domain name
APP_URL_CLIENT=http://localhost:3000
# other client domain name
# Eg: ["http://localhost:3001", "http://localhost:3002"]
OTHER_URLS_CLIENT=
# primary secret key
SECRET_KEY=
# expressed in seconds or a string describing a time span
# Eg: 60, 2 days, 10h, 7d
JWT_EXPIRES_IN=7d
# maximum number of requests per minute
REQUESTS_LIMIT_PER_MINUTE=100
```

-   Config MongoDb Database

```bash
DB_HOST=localhost
DB_PORT=27017
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
```

-   Config Email

```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=no-reply@zent.vn
MAIL_FROM_NAME=
```

3. Install package & setup

```bash
npm install
```

4. Initialize data (Required for new database)

```bash
npm run seed
```

> Note: By default we will use [this account](#default-account) as the **Super Admin**.
> If you want to change it, please set two environment variables **SUPER_ADMIN_EMAIL** and **SUPER_ADMIN_PASSWORD**.
>
> -   Win32 (Windows)
>     ```bash
>     set SUPER_ADMIN_EMAIL=admin@zent.vn
>     set SUPER_ADMIN_PASSWORD=Zent@123.edu.vn
>     npm run seed
>     ```
> -   Posix (Linux, macOS)
>     ```bash
>     export SUPER_ADMIN_EMAIL=admin@zent.vn
>     export SUPER_ADMIN_PASSWORD=Zent@123.edu.vn
>     npm run seed
>     ```
> -   Or add these two variables to the `.env` file

5. Runs the app

```bash
npm run start
```

6. Builds the app for production to the `build` folder

```bash
npm run build
```

7. Runs the app on `production` mode

```bash
node build/main.js
```

> Note: remember set `NODE_ENV=production` in `.env` file

##### Default account

```yaml
Email: admin@zent.vn
Password: Zent@123.edu.vn
```

## Credits

[ZentSoft](https://zentsoft.com).
