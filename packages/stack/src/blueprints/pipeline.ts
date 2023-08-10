import { env } from '@rebel/core';
import { SecretValue } from 'aws-cdk-lib';
import {
  PipelineProject,
  BuildSpec,
  LinuxBuildImage,
} from 'aws-cdk-lib/aws-codebuild';
import {
  Artifact,
  Pipeline as CodePipeline,
} from 'aws-cdk-lib/aws-codepipeline';
import {
  CodeBuildAction,
  GitHubSourceAction,
  S3DeployAction,
} from 'aws-cdk-lib/aws-codepipeline-actions';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export type Pipeline = {
  buildProject: PipelineProject;
  sourceOutput: Artifact;
  buildOutput: Artifact;
  pipeline: CodePipeline;
};

export function usePipeline(stack, websiteBucket: Bucket) {
  const buildProject = stack.codeBuild.pipelineProject();
  const sourceOutput = stack.codeBuild.artifact('RebelSourceArtifact');
  const buildOutput = stack.codeBuild.artifact('RebelBuildArtifact');

  // TODO: Create secret to store github values
  // stack.secretsManager.secret();

  console.log('GITHUB_USERNAME', env('GITHUB_USERNAME'));

  stack.codePipeline.pipeline('RebelStaticWebsitePipeline', [
    {
      stageName: 'Source',
      actions: [
        new GitHubSourceAction({
          actionName: 'Checkout',
          owner: env('GITHUB_USERNAME'),
          repo: env('GITHUB_REPOSITORY'),
          // The GitHub Personal Access Token should have these scopes:
          // - repo - to read the repository
          // - admin: repo_hook - if you plan to use webhooks (true by default )
          oauthToken: env('GITHUB_TOKEN'),
          // TODO: Store your token in Secrets Manager
          // oauthToken: SecretValue.secretsManager(
          //   'YourSecretsManagerGitHubToken'
          // ),
          output: sourceOutput,
          branch: 'main', // or your preferred branch
        }),
      ],
    },
    {
      stageName: 'Build',
      actions: [
        new CodeBuildAction({
          actionName: 'Build',
          project: buildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    },
    {
      stageName: 'Deploy',
      actions: [
        new S3DeployAction({
          actionName: 'DeployToS3',
          input: buildOutput,
          bucket: websiteBucket,
        }),
      ],
    },
  ]);
}
