FROM python:3.7

WORKDIR /app

ENV PYTHONUNBUFFERED 1

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -yq \
    build-essential \
    lcov \
    ldap-utils \
    libldap2-dev \
    libsasl2-dev \
    postgresql-client \
    python3-dev \
    slapd \
    valgrind \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Install pipenv
RUN pip install pipenv

# Install dependencies
COPY Pipfile Pipfile.lock ./
RUN pipenv install --system --deploy

# Copy source-code
COPY . .
