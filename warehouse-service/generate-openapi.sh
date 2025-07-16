#!/bin/bash

# Exit immediately on error
set -e

echo "🛠️ Step 1: Generate tsoa spec and routes..."
npx tsoa spec-and-routes

# Ensure the spec file exists
if [ ! -f ./src/generated/swagger.json ]; then
  echo "❌ Error: swagger.json not found at ./src/generated/swagger.json"
  exit 1
fi

echo "📦 Step 2: Regenerate TypeScript client SDK..."
npx @openapitools/openapi-generator-cli generate \
  -i ./src/generated/swagger.json \
  -o ./client \
  -g typescript-fetch \
  --additional-properties=supportsES6=true,namingConvention=camelCase,apiNameSuffix=Api

echo "📄 Step 3 (optional): Previewing /orders POST schema..."
jq '.paths["/orders"].post.requestBody.content["application/json"].schema' ./src/generated/swagger.json || echo "⚠️ Could not preview /orders POST schema (jq not found or path incorrect)"

echo "✅ Done: OpenAPI spec and client SDK successfully generated."
