# Use an official Node.js runtime as a parent image
FROM node:20.10

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# install next globally
RUN npm install -g next

# Copy the current directory contents into the container at /app
COPY . .

# Build the Next.js app
RUN npm run build

# format the code
RUN npm run format

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app in development mode
CMD ["npm", "run", "dev"]
