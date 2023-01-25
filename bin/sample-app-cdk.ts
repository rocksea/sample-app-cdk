#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
//import * as blueprints from '@aws-quickstart/eks-blueprints';
import * as blueprints from '../lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { CapacityType, KubernetesVersion } from 'aws-cdk-lib/aws-eks';
import { AsgClusterProvider, MngClusterProvider } from '../lib';

const app = new cdk.App();

// AddOns for the cluster.
const addOns: Array<blueprints.ClusterAddOn> = [
    new blueprints.addons.ArgoCDAddOn,
    new blueprints.addons.ArgoRolloutsAddOn,
    new blueprints.addons.MetricsServerAddOn,
    new blueprints.addons.ClusterAutoScalerAddOn,
    new blueprints.addons.ContainerInsightsAddOn,
    new blueprints.addons.AwsLoadBalancerControllerAddOn(),
    new blueprints.addons.VpcCniAddOn(),
    new blueprints.addons.CoreDnsAddOn(),
    new blueprints.addons.KubeProxyAddOn(),
    new blueprints.addons.KarpenterAddOn,
    new blueprints.addons.XrayAddOn()
];

const clusterName = 'eks-blueprint';
const account = '320811633077';
const region = 'ap-northeast-2';


const clusterProvider = new MngClusterProvider({
    version: KubernetesVersion.V1_23,
    clusterName: clusterName,
    forceUpdate:true,
    labels: { "owner": "rocksea" },
    diskSize: 34,
    instanceTypes: [new ec2.InstanceType('m5.2xlarge')],
    nodeGroupCapacityType: CapacityType.ON_DEMAND,
    nodeGroupSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
    }
});


const stack = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .clusterProvider(clusterProvider)
    .addOns(...addOns)
    .build(app, clusterName);
