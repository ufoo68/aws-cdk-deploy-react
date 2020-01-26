#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwsCdkDeployReactStack } from '../lib/aws-cdk-deploy-react-stack';

const app = new cdk.App();
new AwsCdkDeployReactStack(app, 'AwsCdkDeployReactStack');
