ARG VERSION="development"

FROM node:lts-alpine as frontend-build

WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --prod

# Copy source-code
COPY frontend/ .

ARG VERSION
ENV VERSION=${VERSION}

# Create a production build
RUN yarn build


FROM nginx:1.17-alpine

RUN apk --no-cache add curl

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/

COPY --from=frontend-build /app/build /usr/share/nginx/html

ARG VERSION
ENV VERSION=${VERSION}

COPY nginx/upload_source_maps_entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
