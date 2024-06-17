# bussiness-rules-plataform

## Prerequisites

Before starting, you will need to have the following tools installed on your machine:

-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

Clone the repository:

```bash
git clone https://github.com/jteoni/bussiness-rules-plataform.git
cd bussiness-rules-plataform
```

### Start the services:

```bash
docker-compose up
```

### Accessing the application

The application will be available at [http://localhost:8000](http://localhost:8000).

## Overview

-   Upload Feature
-   File Listing
-   File Download
-   Sending Invoices (Emails)

## Automated Tests

### Frontend

For the frontend, we use Jest for automated testing. The tests can be run with the following command:

```bash
yarn test
```

### Backend

In the backend, tests are performed using Django's test framework. To run the tests, use the command:

```bash
python manage.py test
```
