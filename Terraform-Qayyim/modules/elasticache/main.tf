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
