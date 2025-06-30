#!/bin/bash

# Exit on error
set -e

# Step 1: Generate tsoa spec and routes
npx tsoa spec-and-routes

# Step 2: Regenerate OpenAPI client SDK
npx @openapitools/openapi-generator-cli generate \
  -i ./src/generated/swagger.json \
  -o ./client \
  -g typescript-fetch \
  --additional-properties=supportsES6=true,namingConvention=camelCase,apiNameSuffix=Api