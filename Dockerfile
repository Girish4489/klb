# Use an official Node.js runtime as a parent image
FROM node:20.10

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package*.json yarn.lock ./

# Install project dependencies
RUN yarn install --unsafe-perm

# install next globally
RUN yarn global add next

# Copy the current directory contents into the container at /app
COPY . .

# Build the Next.js app
RUN yarn build

# format the code
RUN yarn format

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app in development mode
CMD ["yarn", "dev"]
