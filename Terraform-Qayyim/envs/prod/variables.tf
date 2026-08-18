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
variable "key_pair_name" {
  type    = string
  default = null
}
variable "asg_min"              { type = number }
variable "asg_max"              { type = number }
variable "asg_desired"          { type = number }
