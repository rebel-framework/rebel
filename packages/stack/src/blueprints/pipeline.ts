import { Stack } from '../types';
import { env } from '@rebel-framework/core';
import { PipelineProject } from 'aws-cdk-lib/aws-codebuild';
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

export function usePipeline(stack: Stack, websiteBucket: Bucket) {
  const { codeBuild, codePipeline, secretsManager } = stack;
  const buildProject = codeBuild.pipelineProject();
  const sourceOutput = codePipeline.artifact('RebelSourceArtifact');
  const buildOutput = codePipeline.artifact('RebelBuildArtifact');

  // Create secret to store GitHub token
  const githubTokenSecretName = 'RebelGitHubToken';
  secretsManager.secret(githubTokenSecretName, env('GITHUB_TOKEN'));

  codePipeline.pipeline('RebelStaticWebsitePipeline', [
    {
      stageName: 'Source',
      actions: [
        new GitHubSourceAction({
          actionName: 'Checkout',
          owner: env('GITHUB_USERNAME'),
          repo: env('GITHUB_REPOSITORY'),
          // Retrieve GitHub token from SecretsManager
          oauthToken: secretsManager.value(githubTokenSecretName),
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
