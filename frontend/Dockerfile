ARG VERSION="development"

FROM node:lts-alpine as build

ARG VERSION
ENV REACT_APP_VERSION=${VERSION}

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile

# Copy source-code
COPY . .

# Create a production build
RUN yarn build


FROM nginx:1.17-alpine

ARG VERSION
ENV VERSION=${VERSION}

RUN apk --no-cache add curl

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

COPY --from=build /app/build /usr/share/nginx/html

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
