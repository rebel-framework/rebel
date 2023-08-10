import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import {
  Artifact,
  Pipeline as CodePipeline,
  StageProps as PipelineStageProps,
} from 'aws-cdk-lib/aws-codepipeline';

export default function useCodePipeline(stack: CloudFormationStack) {
  const artifact = (name) => new Artifact(name);

  const pipeline = (name = 'RebelPipeline', stages: PipelineStageProps[]) =>
    new CodePipeline(stack, name, {
      stages: [...stages],
    });

  return {
    artifact,
    pipeline,
  };
}
