#!/bin/bash
set -e

echo "📦 Generating OpenAPI spec for warehouse-service..."
cd "$(dirname "$0")"
npx tsoa spec-and-routes
echo "✅ Done generating tsoa spec for warehouse-service."