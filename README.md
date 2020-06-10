# Samuel

From Google Sheets and punch cards to a single-click order! This project was made to streamline the process of managing and scheduling dishes by our company chef, as well as placing orders by the employees.

## Overview

Instead of each morning sending the dishes available for today to the reception desk and them sending an email to the employees, now the chef could easily do it by himself! Just fill the form for a new dish, choose a date, and click a button to send an email.

After scheduling some dishes and distributing them by email, the users could order them in a simple UI. When the dishes are ready, the chef would let the users know with a click of a button.

Instead of getting a 10-hole punch card and punching it for every order you make, now nothing needs to be done! The accounting department could charge employees by exporting their orders directly from the admin panel.

## Environment Variables

Before developing/deploying, don't forget to set environment variables by:

```sh
cp .env.example .env
```

and modify the values.

## Development

### Prerequisites

#### Back-end

- [Python 3.7](https://www.python.org/downloads/release/python-377/)
- [Pipenv](https://pipenv.kennethreitz.org/)
- [PostgreSQL](https://www.postgresql.org/)
- LDAP server running Active Directory Domain Service (AD DS)

#### Front-end

- [Node.js](https://nodejs.org/)
- [Yarn](https://classic.yarnpkg.com/en/)

### Dependencies

#### Back-end

```sh
cd backend
PIPENV_VENV_IN_PROJECT=true pipenv install -d
```

[`PIPENV_VENV_IN_PROJECT` documentation](https://pipenv.pypa.io/en/latest/advanced/#pipenv.environments.PIPENV_VENV_IN_PROJECT).

#### Front-end

```sh
cd frontend
yarn install
```

### Usage

#### Back-end

##### VS Code

There's a VS Code launch configuration called `Python: Django`, so just hitting F5 should work for both running and debugging.

##### Docker

```sh
cd backend
docker-compose -f docker-compose.dev.yml up
```

#### Front-end

```sh
cd frontend
yarn start
```

## Test

### Back-end

#### VS Code

Just as the `Python: Django` configuration, there the `Python: Django Test` launch configuration that allows to run and debug tests.

#### Docker

```sh
cd backend
docker-compose -f docker-compose.test.yml up --exit-code-from tests
```

### Front-end

```sh
cd frontend
yarn test --runInBand
```

## Deploy

### Download Required Files

```sh
curl https://github.com/eyalch/samuel/blob/production/docker-compose.yml -O
curl https://github.com/eyalch/samuel/blob/production/.env.example -o .env
```

_Don't forget to configure [environment variables](#environment-variables) in `.env`._

### Run

After the CI/CD pipeline has finished successfully, run the following in the same directory where you've [downloaded the required files](#download-required-files):

```sh
docker-compose pull
docker-compose up -d
```

## Technologies

### Back-end

- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [NGINX](https://www.nginx.com/)
- [Pipenv](https://pipenv.kennethreitz.org/)

### Front-end

- [React](https://reactjs.org/)
- [Material UI](https://material-ui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [styled-components](https://styled-components.com/)

### Authentication

- LDAP/Active Directory
- [JWT](https://jwt.io/)

### Error Tracking

- [Rollbar](https://rollbar.com/)
