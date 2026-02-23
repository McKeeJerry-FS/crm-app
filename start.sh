#!/bin/sh
# filepath: start.sh

# Run migrations
npx prisma migrate deploy

# Start the application
node server.js

chmod +x start.sh