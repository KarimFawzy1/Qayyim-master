output "aws_id" {
    value = aws_vpc.main.id
}

output "rds_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "rds_master_secret_arn" {
  value = aws_db_instance.main.master_user_secret[0].secret_arn
}

output "redis_endpoint" {
  value = aws_elasticache_serverless_cache.redis.endpoint
}

output "s3_bucket_name" {
  value = aws_s3_bucket.uploads.bucket
}

output "alb_dns_name" {
  description = "ALB DNS — use this to test before pointing domain"
  value       = aws_lb.main.dns_name
}