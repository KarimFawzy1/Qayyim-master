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
