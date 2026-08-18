# Run this from your Terraform-Qayyim folder in VS Code terminal
# It creates all folders and writes all file contents in one shot

Write-Host "Creating Terraform module structure..." -ForegroundColor Cyan

# ════════════════════════════════════════════════════════════════
# CREATE DIRECTORIES
# ════════════════════════════════════════════════════════════════
$dirs = @(
    "modules/vpc", "modules/security-groups", "modules/iam",
    "modules/rds", "modules/elasticache", "modules/s3",
    "modules/alb", "modules/asg", "envs/dev", "envs/prod"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path $d | Out-Null }

# ════════════════════════════════════════════════════════════════
# MODULES/VPC
# ════════════════════════════════════════════════════════════════
Set-Content "modules/vpc/variables.tf" @'
variable "environment" {
  type = string
}

variable "vpc_cidr" {
  type = string
}

variable "public_subnet_cidrs" {
  type = list(string)
}

variable "private_subnet_cidrs" {
  type = list(string)
}

variable "availability_zones" {
  type = list(string)
}
'@

Set-Content "modules/vpc/main.tf" @'
resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "qayyim-${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name        = "qayyim-${var.environment}-igw"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "qayyim-${var.environment}-public-${count.index + 1}"
    Environment = var.environment
  }
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "qayyim-${var.environment}-private-${count.index + 1}"
    Environment = var.environment
  }
}

resource "aws_eip" "nat" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.this]

  tags = {
    Name        = "qayyim-${var.environment}-nat-eip"
    Environment = var.environment
  }
}

resource "aws_nat_gateway" "this" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
  depends_on    = [aws_internet_gateway.this]

  tags = {
    Name        = "qayyim-${var.environment}-nat"
    Environment = var.environment
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = {
    Name        = "qayyim-${var.environment}-rt-public"
    Environment = var.environment
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.this.id
  }

  tags = {
    Name        = "qayyim-${var.environment}-rt-private"
    Environment = var.environment
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}
'@

Set-Content "modules/vpc/outputs.tf" @'
output "vpc_id" {
  value = aws_vpc.this.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}
'@

# ════════════════════════════════════════════════════════════════
# MODULES/SECURITY-GROUPS
# ════════════════════════════════════════════════════════════════
Set-Content "modules/security-groups/variables.tf" @'
variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}
'@

Set-Content "modules/security-groups/main.tf" @'
resource "aws_security_group" "alb" {
  name        = "qayyim-${var.environment}-sg-alb"
  description = "Allow HTTP and HTTPS from internet"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "qayyim-${var.environment}-sg-alb"
    Environment = var.environment
  }
}

resource "aws_security_group" "app" {
  name        = "qayyim-${var.environment}-sg-app"
  description = "App servers: traffic from ALB only"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "qayyim-${var.environment}-sg-app"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  name        = "qayyim-${var.environment}-sg-rds"
  description = "MySQL from app servers only"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "qayyim-${var.environment}-sg-rds"
    Environment = var.environment
  }
}

resource "aws_security_group" "redis" {
  name        = "qayyim-${var.environment}-sg-redis"
  description = "Redis from app servers only"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "qayyim-${var.environment}-sg-redis"
    Environment = var.environment
  }
}
'@

Set-Content "modules/security-groups/outputs.tf" @'
output "alb_sg_id" {
  value = aws_security_group.alb.id
}

output "app_sg_id" {
  value = aws_security_group.app.id
}

output "rds_sg_id" {
  value = aws_security_group.rds.id
}

output "redis_sg_id" {
  value = aws_security_group.redis.id
}
'@

# ════════════════════════════════════════════════════════════════
# MODULES/IAM
# ════════════════════════════════════════════════════════════════
Set-Content "modules/iam/variables.tf" @'
variable "environment" {
  type = string
}
'@

Set-Content "modules/iam/main.tf" @'
resource "aws_iam_role" "ec2" {
  name = "qayyim-${var.environment}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })

  tags = {
    Name        = "qayyim-${var.environment}-ec2-role"
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "ecr" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "secrets" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}

resource "aws_iam_role_policy_attachment" "s3" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "qayyim-${var.environment}-ec2-profile"
  role = aws_iam_role.ec2.name
}
'@

Set-Content "modules/iam/outputs.tf" @'
output "instance_profile_name" {
  value = aws_iam_instance_profile.ec2.name
}
'@

# ════════════════════════════════════════════════════════════════
# MODULES/RDS
# ════════════════════════════════════════════════════════════════
Set-Content "modules/rds/variables.tf" @'
variable "environment" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "rds_sg_id" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_instance_class" {
  type = string
}
'@

Set-Content "modules/rds/main.tf" @'
resource "aws_db_subnet_group" "this" {
  name       = "qayyim-${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "qayyim-${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_db_instance" "this" {
  identifier        = "qayyim-${var.environment}-mysql"
  engine            = "mysql"
  engine_version    = "8.0"
  instance_class    = var.db_instance_class
  allocated_storage = 20
  storage_type      = "gp2"

  db_name  = var.db_name
  username = var.db_username

  manage_master_user_password = true

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [var.rds_sg_id]

  multi_az            = false
  publicly_accessible = false

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  deletion_protection = false
  skip_final_snapshot = true

  lifecycle {
    ignore_changes = [password]
  }

  tags = {
    Name        = "qayyim-${var.environment}-mysql"
    Environment = var.environment
  }
}
'@

Set-Content "modules/rds/outputs.tf" @'
output "endpoint" {
  value = aws_db_instance.this.endpoint
}

output "master_secret_arn" {
  value = aws_db_instance.this.master_user_secret[0].secret_arn
}
'@

# ════════════════════════════════════════════════════════════════
# MODULES/ELASTICACHE
# ════════════════════════════════════════════════════════════════
Set-Content "modules/elasticache/variables.tf" @'
variable "environment" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "redis_sg_id" {
  type = string
}

variable "elasticache_name" {
  type = string
}
'@

Set-Content "modules/elasticache/main.tf" @'
resource "aws_elasticache_serverless_cache" "this" {
  engine = "redis"
  name   = var.elasticache_name

  cache_usage_limits {
    data_storage {
      maximum = 1
      unit    = "GB"
    }
    ecpu_per_second {
      maximum = 1000
    }
  }

  subnet_ids         = var.private_subnet_ids
  security_group_ids = [var.redis_sg_id]

  tags = {
    Name        = var.elasticache_name
    Environment = var.environment
  }
}
'@

Set-Content "modules/elasticache/outputs.tf" @'
output "endpoint" {
  value = aws_elasticache_serverless_cache.this.endpoint
}
'@

# ════════════════════════════════════════════════════════════════
# MODULES/S3
# ════════════════════════════════════════════════════════════════
Set-Content "modules/s3/variables.tf" @'
variable "environment" {
  type = string
}

variable "s3_bucket_name" {
  type = string
}
'@

Set-Content "modules/s3/main.tf" @'
resource "aws_s3_bucket" "this" {
  bucket = var.s3_bucket_name

  tags = {
    Name        = var.s3_bucket_name
    Environment = var.environment
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket                  = aws_s3_bucket.this.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "this" {
  bucket     = aws_s3_bucket.this.id
  depends_on = [aws_s3_bucket_public_access_block.this]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.this.arn}/*"
    }]
  })
}

resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.this.id
  versioning_configuration {
    status = "Enabled"
  }
}
'@

Set-Content "modules/s3/outputs.tf" @'
output "bucket_name" {
  value = aws_s3_bucket.this.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.this.arn
}
'@

# ════════════════════════════════════════════════════════════════
# MODULES/ALB
# ════════════════════════════════════════════════════════════════
Set-Content "modules/alb/variables.tf" @'
variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "alb_sg_id" {
  type = string
}

variable "acm_certificate_arn" {
  type = string
}
'@

Set-Content "modules/alb/main.tf" @'
resource "aws_lb" "this" {
  name               = "qayyim-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_sg_id]
  subnets            = var.public_subnet_ids

  tags = {
    Name        = "qayyim-${var.environment}-alb"
    Environment = var.environment
  }
}

resource "aws_lb_target_group" "app" {
  name        = "qayyim-${var.environment}-tg-app"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    enabled             = true
    path                = "/api/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
    timeout             = 5
    matcher             = "200"
  }

  tags = {
    Name        = "qayyim-${var.environment}-tg-app"
    Environment = var.environment
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}
'@

Set-Content "modules/alb/outputs.tf" @'
output "alb_dns_name" {
  value = aws_lb.this.dns_name
}

output "target_group_arn" {
  value = aws_lb_target_group.app.arn
}
'@

# ════════════════════════════════════════════════════════════════
# MODULES/ASG
# ════════════════════════════════════════════════════════════════
Set-Content "modules/asg/variables.tf" @'
variable "environment" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "target_group_arn" {
  type = string
}

variable "app_sg_id" {
  type = string
}

variable "instance_profile_name" {
  type = string
}

variable "ami_id" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "key_pair_name" {
  type    = string
  default = null
}

variable "asg_min" {
  type = number
}

variable "asg_max" {
  type = number
}

variable "asg_desired" {
  type = number
}
'@

Set-Content "modules/asg/main.tf" @'
resource "aws_launch_template" "this" {
  name          = "qayyim-${var.environment}-lt"
  description   = "Qayyim ${var.environment} EC2 launch template"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_pair_name

  iam_instance_profile {
    name = var.instance_profile_name
  }

  vpc_security_group_ids = [var.app_sg_id]

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 2
  }

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size           = 30
      volume_type           = "gp3"
      delete_on_termination = true
    }
  }

  user_data = filebase64("${path.root}/user_data.sh")

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name        = "qayyim-${var.environment}-app"
      Environment = var.environment
    }
  }

  tags = {
    Name        = "qayyim-${var.environment}-lt"
    Environment = var.environment
  }
}

resource "aws_autoscaling_group" "this" {
  name                      = "qayyim-${var.environment}-asg"
  vpc_zone_identifier       = var.private_subnet_ids
  target_group_arns         = [var.target_group_arn]
  health_check_type         = "ELB"
  health_check_grace_period = 300
  min_size                  = var.asg_min
  max_size                  = var.asg_max
  desired_capacity          = var.asg_desired

  launch_template {
    id      = aws_launch_template.this.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "qayyim-${var.environment}-app"
    propagate_at_launch = true
  }

  tag {
    key                 = "Environment"
    value               = var.environment
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_policy" "cpu" {
  name                   = "qayyim-${var.environment}-cpu-policy"
  autoscaling_group_name = aws_autoscaling_group.this.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
'@

Set-Content "modules/asg/outputs.tf" @'
output "asg_name" {
  value = aws_autoscaling_group.this.name
}
'@

# ════════════════════════════════════════════════════════════════
# ENVS/DEV
# ════════════════════════════════════════════════════════════════
Set-Content "envs/dev/main.tf" @'
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.31"
    }
  }

  backend "s3" {
    bucket         = "qayyim-terraform-state-491991045754"
    key            = "dev/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "qayyim-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source               = "../../modules/vpc"
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
}

module "security_groups" {
  source      = "../../modules/security-groups"
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
}

module "iam" {
  source      = "../../modules/iam"
  environment = var.environment
}

module "rds" {
  source             = "../../modules/rds"
  environment        = var.environment
  private_subnet_ids = module.vpc.private_subnet_ids
  rds_sg_id          = module.security_groups.rds_sg_id
  db_name            = var.db_name
  db_username        = var.db_username
  db_instance_class  = var.db_instance_class
}

module "elasticache" {
  source             = "../../modules/elasticache"
  environment        = var.environment
  private_subnet_ids = module.vpc.private_subnet_ids
  redis_sg_id        = module.security_groups.redis_sg_id
  elasticache_name   = var.elasticache_name
}

module "s3" {
  source         = "../../modules/s3"
  environment    = var.environment
  s3_bucket_name = var.s3_bucket_name
}

module "alb" {
  source              = "../../modules/alb"
  environment         = var.environment
  vpc_id              = module.vpc.vpc_id
  public_subnet_ids   = module.vpc.public_subnet_ids
  alb_sg_id           = module.security_groups.alb_sg_id
  acm_certificate_arn = var.acm_certificate_arn
}

module "asg" {
  source                = "../../modules/asg"
  environment           = var.environment
  private_subnet_ids    = module.vpc.private_subnet_ids
  target_group_arn      = module.alb.target_group_arn
  app_sg_id             = module.security_groups.app_sg_id
  instance_profile_name = module.iam.instance_profile_name
  ami_id                = var.ami_id
  instance_type         = var.instance_type
  key_pair_name         = var.key_pair_name
  asg_min               = var.asg_min
  asg_max               = var.asg_max
  asg_desired           = var.asg_desired
}
'@

Set-Content "envs/dev/variables.tf" @'
variable "aws_region"           { type = string }
variable "environment"          { type = string }
variable "vpc_cidr"             { type = string }
variable "public_subnet_cidrs"  { type = list(string) }
variable "private_subnet_cidrs" { type = list(string) }
variable "availability_zones"   { type = list(string) }
variable "db_name"              { type = string }
variable "db_username"          { type = string }
variable "db_instance_class"    { type = string }
variable "elasticache_name"     { type = string }
variable "s3_bucket_name"       { type = string }
variable "acm_certificate_arn"  { type = string }
variable "ami_id"               { type = string }
variable "instance_type"        { type = string }
variable "key_pair_name"        { type = string  default = null }
variable "asg_min"              { type = number }
variable "asg_max"              { type = number }
variable "asg_desired"          { type = number }
'@

Set-Content "envs/dev/terraform.tfvars" @'
aws_region           = "eu-central-1"
environment          = "dev"
vpc_cidr             = "10.1.0.0/16"
public_subnet_cidrs  = ["10.1.1.0/24", "10.1.2.0/24"]
private_subnet_cidrs = ["10.1.11.0/24", "10.1.12.0/24"]
availability_zones   = ["eu-central-1a", "eu-central-1b"]
db_name              = "qayyim"
db_username          = "admin"
db_instance_class    = "db.t3.micro"
elasticache_name     = "qayyim-dev-redis"
s3_bucket_name       = "qayyim-dev-uploads-491991045754"
acm_certificate_arn  = "arn:aws:acm:eu-central-1:491991045754:certificate/REPLACE-WITH-YOUR-CERT-ID"
ami_id               = "ami-0f1834be8d049e69f"
instance_type        = "t2.small"
key_pair_name        = "bastion-host"
asg_min              = 1
asg_max              = 2
asg_desired          = 1
'@

Set-Content "envs/dev/outputs.tf" @'
output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

output "rds_endpoint" {
  value = module.rds.endpoint
}

output "rds_master_secret_arn" {
  value = module.rds.master_secret_arn
}

output "redis_endpoint" {
  value = module.elasticache.endpoint
}

output "s3_bucket_name" {
  value = module.s3.bucket_name
}
'@

# ════════════════════════════════════════════════════════════════
# ENVS/PROD
# ════════════════════════════════════════════════════════════════
Set-Content "envs/prod/main.tf" @'
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.31"
    }
  }

  backend "s3" {
    bucket         = "qayyim-terraform-state-491991045754"
    key            = "prod/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "qayyim-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source               = "../../modules/vpc"
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
}

module "security_groups" {
  source      = "../../modules/security-groups"
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
}

module "iam" {
  source      = "../../modules/iam"
  environment = var.environment
}

module "rds" {
  source             = "../../modules/rds"
  environment        = var.environment
  private_subnet_ids = module.vpc.private_subnet_ids
  rds_sg_id          = module.security_groups.rds_sg_id
  db_name            = var.db_name
  db_username        = var.db_username
  db_instance_class  = var.db_instance_class
}

module "elasticache" {
  source             = "../../modules/elasticache"
  environment        = var.environment
  private_subnet_ids = module.vpc.private_subnet_ids
  redis_sg_id        = module.security_groups.redis_sg_id
  elasticache_name   = var.elasticache_name
}

module "s3" {
  source         = "../../modules/s3"
  environment    = var.environment
  s3_bucket_name = var.s3_bucket_name
}

module "alb" {
  source              = "../../modules/alb"
  environment         = var.environment
  vpc_id              = module.vpc.vpc_id
  public_subnet_ids   = module.vpc.public_subnet_ids
  alb_sg_id           = module.security_groups.alb_sg_id
  acm_certificate_arn = var.acm_certificate_arn
}

module "asg" {
  source                = "../../modules/asg"
  environment           = var.environment
  private_subnet_ids    = module.vpc.private_subnet_ids
  target_group_arn      = module.alb.target_group_arn
  app_sg_id             = module.security_groups.app_sg_id
  instance_profile_name = module.iam.instance_profile_name
  ami_id                = var.ami_id
  instance_type         = var.instance_type
  key_pair_name         = var.key_pair_name
  asg_min               = var.asg_min
  asg_max               = var.asg_max
  asg_desired           = var.asg_desired
}
'@

Copy-Item "envs/dev/variables.tf" "envs/prod/variables.tf"
Copy-Item "envs/dev/outputs.tf"   "envs/prod/outputs.tf"

Set-Content "envs/prod/terraform.tfvars" @'
aws_region           = "eu-central-1"
environment          = "prod"
vpc_cidr             = "10.0.0.0/16"
public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24"]
availability_zones   = ["eu-central-1a", "eu-central-1b"]
db_name              = "qayyim"
db_username          = "admin"
db_instance_class    = "db.t3.micro"
elasticache_name     = "qayyim-prod-redis"
s3_bucket_name       = "ai-exam-grader-pdfs"
acm_certificate_arn  = "arn:aws:acm:eu-central-1:491991045754:certificate/REPLACE-WITH-YOUR-CERT-ID"
ami_id               = "ami-0f1834be8d049e69f"
instance_type        = "t2.small"
key_pair_name        = "bastion-host"
asg_min              = 1
asg_max              = 2
asg_desired          = 1
'@

Write-Host ""
Write-Host "Done! Structure created:" -ForegroundColor Green
Get-ChildItem -Recurse -Include "*.tf","*.tfvars","*.sh" | Select-Object FullName