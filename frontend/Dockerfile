FROM node:lts-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --prod

# Copy source-code
COPY . .

# Create a production build
RUN yarn build

# The build result, `/app/build`, is then used by a volume
