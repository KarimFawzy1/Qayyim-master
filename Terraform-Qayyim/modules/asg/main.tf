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
