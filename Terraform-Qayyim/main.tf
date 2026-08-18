# PROVIDER

terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~>5.31"
        }
    }
}

provider "aws" {
    region = var.aws_region
}
# ── VPC ──────────────────────────────────────────

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "qayyim-${var.environment}-vpc"     # "${}" is string interpolation — injects variable value into string
    Environment = var.environment
  }
}

# ── INTERNET GATEWAY ──────────────────────────────────────────

resource "aws_internet_gateway" "main" { 
    vpc_id = aws_vpc.main.id
    
    tags = {
        Name = "qayyim-${var.environment}-igw"
        Environment = var.environment
    }
}

# ── PUBLIC SUBNETS ────────────────────────────────────────────
# count creates multiple resources from one block
# count.index = 0, 1, 2... for each iteration
resource "aws_subnet" "public" {
  count = length(var.private_subnet_cidrs)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "qayyim-${var.environment}-public-${count.index + 1}"
    Environment = var.environment
  }
}

# ── PRIVATE SUBNETS ───────────────────────────────────────────
resource "aws_subnet" "private" {
  count = length(var.private_subnet_cidrs)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "qayyim-${var.environment}-private-${count.index + 1}"
    Environment = var.environment
  }
}

# ── ELASTIC IP for NAT ────────────────────────────────────────
resource "aws_eip" "nat" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.main]

  tags = {
    Name        = "qayyim-${var.environment}-nat-eip"
    Environment = var.environment
  }
}

# ── NAT GATEWAY ───────────────────────────────────────────────
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
  depends_on    = [aws_internet_gateway.main]

  tags = {
    Name        = "qayyim-${var.environment}-nat"
    Environment = var.environment
  }
}

# ── ROUTE TABLES ──────────────────────────────────────────────
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "qayyim-${var.environment}-rt-public"
    Environment = var.environment
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name        = "qayyim-${var.environment}-rt-private"
    Environment = var.environment
  }
}

# ── ROUTE TABLE ASSOCIATIONS ──────────────────────────────────
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

# ════════════════════════════════════════════════════════════════
# SECURITY GROUPS
# ════════════════════════════════════════════════════════════════

# ── ALB SG ───────────────────────────────────────────────────
resource "aws_security_group" "alb" {
  name        = "qayyim-${var.environment}-sg-alb"
  description = "Allow HTTP and HTTPS from internet"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"         # -1 means all protocols
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "qayyim-${var.environment}-sg-alb"
    Environment = var.environment
  }
}

# ── APP SG ───────────────────────────────────────────────────
# References ALB and bastion SGs by ID — not CIDR
# This is the SG-to-SG referencing pattern
resource "aws_security_group" "app" {
  name        = "qayyim-${var.environment}-sg-app"
  description = "App servers: traffic from ALB only"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Next.js from ALB"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    # Only traffic coming from ALB SG is allowed — not any IP
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

# ── RDS SG ───────────────────────────────────────────────────
resource "aws_security_group" "rds" {
  name        = "qayyim-${var.environment}-sg-rds"
  description = "MySQL from app servers only"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "MySQL from app"
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

# ── REDIS SG ─────────────────────────────────────────────────
resource "aws_security_group" "redis" {
  name        = "qayyim-${var.environment}-sg-redis"
  description = "Redis from app servers only"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Redis from app"
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

# ════════════════════════════════════════════════════════════════
# IAM ROLE FOR EC2
# ════════════════════════════════════════════════════════════════

# The role itself — defines WHO can assume it
resource "aws_iam_role" "ec2" {
  name = "qayyim-${var.environment}-ec2-role"

  # assume_role_policy = who is allowed to use this role
  # This says: EC2 service can assume this role
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name        = "qayyim-${var.environment}-ec2-role"
    Environment = var.environment
  }
}

# Attach AWS managed policies to the role
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

# Instance profile = wrapper that lets EC2 use the role
# EC2 doesn't use roles directly — it uses instance profiles
resource "aws_iam_instance_profile" "ec2" {
  name = "qayyim-${var.environment}-ec2-profile"
  role = aws_iam_role.ec2.name
}

# ════════════════════════════════════════════════════════════════
# LAUNCH TEMPLATE
# ════════════════════════════════════════════════════════════════

resource "aws_launch_template" "app" {
  name        = "qayyim-${var.environment}-lt"
  description = "Qayyim ${var.environment} EC2 launch template"

  image_id      = var.ami_id
  instance_type = var.instance_type

  # Attach the IAM role via instance profile
  iam_instance_profile {
    name = aws_iam_instance_profile.ec2.name
  }

  # Attach app security group
  vpc_security_group_ids = [aws_security_group.app.id]

  # IMDSv2 required + hop limit 2 for Docker containers
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"    # IMDSv2 only
    http_put_response_hop_limit = 2             # allows Docker to reach metadata
  }

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size           = 30
      volume_type           = "gp3"
      delete_on_termination = true
    }
  }

  # User data runs on every fresh instance boot
  # filebase64 reads a local file and base64 encodes it
  # EC2 expects user data as base64
  user_data = filebase64("${path.module}/user_data.sh")
  # path.module = directory of this main.tf file

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

# ════════════════════════════════════════════════════════════════
# RDS
# ════════════════════════════════════════════════════════════════

resource "aws_db_subnet_group" "main" {
  name       = "qayyim-${var.environment}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name        = "qayyim-${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_db_instance" "main" {
  identifier        = "qayyim-${var.environment}-mysql"
  engine            = "mysql"
  engine_version    = "8.0"
  instance_class    = var.db_instance_class
  allocated_storage = 20
  storage_type      = "gp2"

  db_name  = var.db_name
  username = var.db_username

  manage_master_user_password = true

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  multi_az            = false
  publicly_accessible = false

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  deletion_protection = false
  skip_final_snapshot = true

  tags = {
    Name        = "qayyim-${var.environment}-mysql"
    Environment = var.environment
  }
}

# ════════════════════════════════════════════════════════════════
# ELASTICACHE REDIS SERVERLESS
# ════════════════════════════════════════════════════════════════

resource "aws_elasticache_serverless_cache" "redis" {
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

  subnet_ids         = aws_subnet.private[*].id
  security_group_ids = [aws_security_group.redis.id]

  tags = {
    Name        = var.elasticache_name
    Environment = var.environment
  }
}

# ════════════════════════════════════════════════════════════════
# S3
# ════════════════════════════════════════════════════════════════

resource "aws_s3_bucket" "uploads" {
  bucket = var.s3_bucket_name

  tags = {
    Name        = var.s3_bucket_name
    Environment = var.environment
  }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket                  = aws_s3_bucket.uploads.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "uploads" {
  bucket     = aws_s3_bucket.uploads.id
  depends_on = [aws_s3_bucket_public_access_block.uploads]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.uploads.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_cors_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration {
    status = "Enabled"
  }
}

# ════════════════════════════════════════════════════════════════
# ALB
# ════════════════════════════════════════════════════════════════

resource "aws_lb" "main" {
  name               = "qayyim-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  tags = {
    Name        = "qayyim-${var.environment}-alb"
    Environment = var.environment
  }
}

resource "aws_lb_target_group" "app" {
  name        = "qayyim-${var.environment}-tg-app"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    enabled             = true
    path                = "/api/health"
    port                = "traffic-port"
    protocol            = "HTTP"
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

# HTTP listener — redirects to HTTPS
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
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

# HTTPS listener — needs ACM cert
# We reference the cert by ARN from variable
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# ════════════════════════════════════════════════════════════════
# AUTO SCALING GROUP
# ════════════════════════════════════════════════════════════════

resource "aws_autoscaling_group" "app" {
  name = "qayyim-${var.environment}-asg"

  vpc_zone_identifier = aws_subnet.private[*].id
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300

  min_size         = var.asg_min
  max_size         = var.asg_max
  desired_capacity = var.asg_desired

  launch_template {
    id      = aws_launch_template.app.id
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

# Auto scaling policy — scale up when CPU > 70%
resource "aws_autoscaling_policy" "cpu" {
  name                   = "qayyim-${var.environment}-cpu-policy"
  autoscaling_group_name = aws_autoscaling_group.app.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 70.0
  }
}