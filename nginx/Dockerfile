FROM node:lts-alpine as frontend-build

WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --prod

# Copy source-code
COPY frontend/ .

# Create a production build
RUN yarn build


FROM nginx:1.17-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/

COPY --from=frontend-build /app/build /usr/share/nginx/html
