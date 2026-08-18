# variables.tf

# A variable has 3 optional parts:
# - description: human readable explanation
# - type: string, number, bool, list, map
# - default: value used if nothing is passed in

variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Environment name — used to name all resources"
  type        = string
  default     = "dev"
}

# ------- VPC ---------------
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.1.0.0/16"
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

# ------- SG/LAUNCH TEMPLATE ---------------

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "ecr_account_id" {
  description = "AWS account ID for ECR registry"
  type        = string
}

variable "ami_id" {
  description = "AMI ID for EC2 instances"
  type        = string
}

# ------- DB/ASG/ALB ---------------


variable "db_name" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_instance_class" {
  type = string
}

variable "elasticache_name" {
  type = string
}

variable "s3_bucket_name" {
  type = string
}

variable "acm_certificate_arn" {
  description = "ARN of ACM certificate for HTTPS listener (must be in eu-central-1)"
  type        = string
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