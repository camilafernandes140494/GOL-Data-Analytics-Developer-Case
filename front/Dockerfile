# Stage 1
FROM node:18 as node

# Copy project
COPY . /gdadc/

# Set work directory
WORKDIR /gdadc/

# Build project
RUN npm install
RUN npm run build


# Stage 2
FROM nginx

# Expose ports
EXPOSE 80
EXPOSE 443

# Copy config file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy project
COPY --from=node /gdadc/dist/frontend/browser /usr/share/nginx/html

