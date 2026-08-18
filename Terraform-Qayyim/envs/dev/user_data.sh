#!/bin/bash
# Remove set -e — let script continue even if individual steps have warnings
exec > /var/log/user-data.log 2>&1



echo "=== Starting user data script ==="
date

token=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

# 1. Install dependencies
yum update -y
yum install -y docker jq aws-cli
systemctl enable docker
systemctl start docker
usermod -a -G docker ec2-user

# 2. Install docker compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 3. Create app directory
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

# 4. Write secrets to .env from Secrets Manager
echo "=== Fetching secrets ==="
aws secretsmanager get-secret-value \
  --secret-id qayyim/dev/app \
  --region eu-central-1 \
  --query SecretString \
  --output text | jq -r 'to_entries|map("\(.key)=\(.value)")|.[]' \
  > /home/ec2-user/app/.env

echo "=== Secrets fetched, .env has $(wc -l < .env) lines ==="

# 5. Append non-secret config
cat >> /home/ec2-user/app/.env <<'EOF'
NODE_ENV=production
AWS_REGION=eu-central-1
AWS_S3_BUCKET_NAME=ai-exam-grader-pdfs
OCR_SERVICE_URL=http://localhost:5003
AI_GRADING_SERVICE_URL=http://localhost:5000
EOF

# 6. Pull docker-compose from S3
echo "=== Pulling docker-compose from S3 ==="
aws s3 cp s3://ai-exam-grader-pdfs/config/docker-compose.prod.yml \
  /home/ec2-user/app/docker-compose.yml

# 7. Login to ECR
echo "=== Logging into ECR ==="
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin \
  491991045754.dkr.ecr.eu-central-1.amazonaws.com

# 8. Pull images and start
echo "=== Pulling Docker images ==="
docker-compose -f /home/ec2-user/app/docker-compose.yml pull

echo "=== Starting containers ==="
docker-compose -f /home/ec2-user/app/docker-compose.yml up -d

echo "=== Setup complete ==="
date