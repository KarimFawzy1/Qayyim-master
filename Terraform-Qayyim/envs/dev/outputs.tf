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
