import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import {
  PipelineProject,
  BuildSpec,
  LinuxBuildImage,
} from 'aws-cdk-lib/aws-codebuild';

export default function useCodeBuild(stack: CloudFormationStack) {
  const pipelineProject = (name = 'RebelBuildProject') =>
    new PipelineProject(stack, name, {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: ['npm install', 'npm run build'],
          },
        },
        artifacts: {
          'base-directory': 'build',
          files: ['**/*'],
        },
      }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
      },
    });

  return { pipelineProject };
}
