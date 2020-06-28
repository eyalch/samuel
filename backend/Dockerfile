FROM python:3.7 AS base

ARG VERSION="development"
ENV VERSION=${VERSION}

ARG BRANCH="master"
ENV BRANCH=${BRANCH}

WORKDIR /app

ENV PYTHONUNBUFFERED 1

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -yq --no-install-recommends \
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

CMD [ "daphne", "-b", "0.0.0.0", "-p", "8000", "samuel.asgi:application" ]

EXPOSE 8000


FROM base AS cron

RUN apt-get update && apt-get -y install -qq cron

RUN crontab /app/jobs.crontab

RUN chmod +x /app/cron_entrypoint.sh
ENTRYPOINT [ "/app/cron_entrypoint.sh" ]
