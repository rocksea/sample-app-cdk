import { Cluster } from 'aws-cdk-lib/aws-eks';
import { createNamespace } from "../../utils/namespace-utils";
import { HelmAddOn, HelmAddOnProps, HelmAddOnUserProps } from "../helm-addon";

type ArgoRolloutsAddOnProps = HelmAddOnUserProps;

const ARGOROLLOUTS = 'argorollouts';

const defaultProps: HelmAddOnProps = {
    name: ARGOROLLOUTS,
    namespace: ARGOROLLOUTS,
    version: '2.21.1',
    chart: "argo-rollouts",
    release: "bluprints-addon-argorollouts",
    repository: "https://argoproj.github.io/argo-helm"
};

export class ArgoRolloutsAddOn extends HelmAddOn {

    private options: ArgoRolloutsAddOnProps;

    constructor(props?: ArgoRolloutsAddOnProps) {
        super({ ...defaultProps, ...props });
        this.options = this.props;
    }

    deploy(cluster: Cluster): void {
        const ns = createNamespace(this.options.namespace!, cluster, true, true);
        this.addHelmChart(cluster, this.options.values);
    }
}
