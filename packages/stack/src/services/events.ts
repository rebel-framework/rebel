import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as Events from 'aws-cdk-lib/aws-events';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as Targets from 'aws-cdk-lib/aws-events-targets';

export default function useEvents(stack: CloudFormationStack) {
  const eventBus = (
    eventBusName: string,
    eventBusProps?: Events.EventBusProps
  ) => new Events.EventBus(stack, eventBusName, eventBusProps);

  const rule = (ruleName: string, ruleProps: Events.RuleProps) =>
    new Events.Rule(stack, ruleName, ruleProps);

  const targetLambda = (lambdaFunction: Lambda.Function) =>
    new Targets.LambdaFunction(lambdaFunction);

  return { eventBus, rule, targetLambda };
}
