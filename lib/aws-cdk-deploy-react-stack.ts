import * as cdk from '@aws-cdk/core'
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import * as s3 from '@aws-cdk/aws-s3'
import * as s3deploy from '@aws-cdk/aws-s3-deployment'
import * as iam from '@aws-cdk/aws-iam'
import * as waf from "@aws-cdk/aws-waf"

export class AwsCdkDeployReactStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const ipSet = new waf.CfnIPSet(this, 'IpSet', {
      name: 'whiteList',
      ipSetDescriptors: [
        {
          type: 'IPV4',
          value: '0.0.0.0/32'
        }
      ]
    })

    const rule = new waf.CfnRule(this, 'rule', {
      metricName: 'whiteListRule',
      name: 'whiteList',
      predicates: [
        {
          dataId: ipSet.ref,
          negated: false,
          type: 'IPMatch',
        }
      ]
    })

    const webAcl = new waf.CfnWebACL(this, 'webAcl', {
      defaultAction: {
        type: 'BLOCK',
      },
      metricName: 'webAcl',
      name: 'webAcl',
      rules: [
        {
          action: {
            type: 'ALLOW',
          },
          priority: 1,
          ruleId: rule.ref,
        }
      ]
    })

    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteErrorDocument: 'index.html',
      websiteIndexDocument: 'index.html',
    })

    const websiteIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'WebsiteIdentity',
    )

    const webSiteBucketPolicyStatement = new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: iam.Effect.ALLOW,
      principals: [
        websiteIdentity.grantPrincipal,
      ],
      resources: [`${websiteBucket.bucketArn}/*`],
    })
    websiteBucket.addToResourcePolicy(webSiteBucketPolicyStatement)
    const websiteDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'WebsiteDistribution',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: websiteBucket,
              originAccessIdentity: websiteIdentity,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
        webACLId: webAcl.ref,
      },
    )
    new s3deploy.BucketDeployment(this, 'WebsiteDeploy', {
      sources: [s3deploy.Source.asset('./react-liff/build')],
      destinationBucket: websiteBucket,
      distribution: websiteDistribution,
      distributionPaths: ['/*'],
    })
  }
}