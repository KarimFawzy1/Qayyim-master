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
