#!/bin/bash

# Generate OpenAPI spec and routes
npx tsoa spec-and-routes

# Generate the client SDK from that spec
npx @openapitools/openapi-generator-cli generate \
  -i ./src/generated/swagger.json \
  -o ./client \
  -g typescript-fetch