# --- Load environment variables from .env file ---
-include .env
export $(shell sed 's/=.*//' .env)

# --- Config ---
BUILD_DIR := dist
AWS := aws --region $(AWS_REGION) --profile $(AWS_PROFILE)

# --- Targets ---
.PHONY: build upload deploy clean

build:
	npm run build

upload:
	@echo "Deploying $(BUILD_DIR) to s3://$(AWS_S3_BUCKET)..."
	$(AWS) s3 sync $(BUILD_DIR)/ s3://$(AWS_S3_BUCKET)/ --delete \
	  --cache-control "public,max-age=31536000,immutable"
	$(AWS) s3 cp $(BUILD_DIR)/index.html s3://$(AWS_S3_BUCKET)/index.html \
	  --cache-control "no-cache"
	@echo "✅ Deployed to s3://$(AWS_S3_BUCKET)"

clean:
	rm -rf $(BUILD_DIR)

deploy: build upload
