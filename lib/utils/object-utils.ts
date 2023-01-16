import { KubernetesVersion } from "aws-cdk-lib/aws-eks";
import { cloneDeepWith } from 'lodash';

export const setPath = (obj : any, path: string, val: any) => { 
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const lastObj = keys.reduce((obj, key) => 
        obj[key] = obj[key] || {}, 
        obj); 
    lastObj[lastKey] = val;
};


export function cloneDeep<T>(source: T): T {
    return cloneDeepWith(source, (value) => {
        if(value && value instanceof KubernetesVersion) {
            return value;
        }
        return undefined;
    });
}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };