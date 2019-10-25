FROM python:3.7-alpine

WORKDIR /app

ENV PYTHONUNBUFFERED 1

RUN apk update \
    # Install build dependencies
    && apk add --virtual .build-deps gcc python3-dev musl-dev \
    # psycopg2 dependencies
    && apk add postgresql-dev \
    # Pillow dependencies
    && apk add jpeg-dev zlib-dev freetype-dev lcms2-dev openjpeg-dev tiff-dev tk-dev tcl-dev

# Install pipenv
RUN pip install pipenv

# Install dependencies
COPY Pipfile Pipfile.lock ./
RUN pipenv install --system --ignore-pipfile --deploy

# Copy source-code
COPY . .
