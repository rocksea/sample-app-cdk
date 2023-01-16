import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as blueprints from '../lib';
import { CapacityType, KubernetesVersion } from 'aws-cdk-lib/aws-eks';
import { AsgClusterProvider, MngClusterProvider } from '../lib';

const clusterName = 'eks-blueprint';
const account = '320811633077';
const region = 'ap-northeast-2';

test('API Gateway Created', () => {
    const app = new cdk.App();
    const blueprint = blueprints.EksBlueprint.builder();
    
    blueprint.account("123567891").region('us-west-1')
       .addOns(new blueprints.VpcCniAddOn, new blueprints.KarpenterAddOn(), new blueprints.ClusterAutoScalerAddOn)
       .teams(new blueprints.PlatformTeam({ name: 'platform' }));
   
    const stack = blueprints.EksBlueprint.builder()
        .account(account).region(region)
        .version(KubernetesVersion.V1_23).build(app, "stack-123");
    
    const template = Template.fromStack(stack);

    template.hasResource("AWS::Lambda::LayerVersion", {
        Properties: {
          Description: Match.stringLikeRegexp("/opt/kubectl/kubectl 1.23"),
        },
    });
});

