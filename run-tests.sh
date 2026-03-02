#!/bin/bash
export SERVER_PROTOCOL=http
export SERVER_HOST=localhost
export SERVER_PORT=4000
export DB_NAME=testdb
export JWT_SECRET=testsecret

echo "Waiting for databases to initialize (Wait 25s)..."
sleep 25

echo "==============================="
echo "Running MongoDB tests..."
echo "==============================="
export DB_TYPE=mongodb
export DB_HOST=localhost
export DB_PORT=27018
export DB_USER=""
export DB_PASS=""
export DB_NAME=testdb
npx jest __tests__/sample.test.ts --verbose --runInBand --forceExit

echo "==============================="
echo "Running MySQL tests..."
echo "==============================="
export DB_TYPE=mysql
export DB_HOST=localhost
export DB_PORT=3307
export DB_USER=root
export DB_PASS=root
export DB_NAME=testdb
npx jest __tests__/sample.test.ts --verbose --runInBand --forceExit

echo "==============================="
echo "Running PostgreSQL tests..."
echo "==============================="
export DB_TYPE=postgres
export DB_HOST=localhost
export DB_PORT=5433
export DB_USER=root
export DB_PASS=root
export DB_NAME=testdb
npx jest __tests__/sample.test.ts --verbose --runInBand --forceExit
