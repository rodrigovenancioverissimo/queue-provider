import SQS from 'aws-sdk/clients/sqs';
import { Consumer } from 'sqs-consumer';

export default interface IQueueProvider {
  sendMessage(params: IQueueProviderAddInput): Promise<IQueueProviderAddOutput>;
  createQueue(
    params: IQueueProviderCreateQueueInput
  ): Promise<IQueueProviderCreateQueueOutput>;
  checkQueueExists(
    params: IQueueProviderCheckQueueExistsInput
  ): Promise<boolean>;
  createConsumer(params: IQueueProviderCreateConsumerInput): Promise<IConsumer>;
  deleteQueue(params: IQueueProviderDeleteQueueInput): Promise<void>;
}

export type IQueueProviderDeleteQueueInput = {
  queueName: string;
};

export type IQueueProviderCreateConsumerInput = {
  queueName: string;
  handleMessage: IQueueProviderCreateConsumerInputHandlerMessage;
};

export type IQueueProviderCreateConsumerInputHandlerMessage = (
  message: SQS.Message
) => Promise<void>;

export type IQueueProviderAddInput = {
  body: QueueBodyType;
  queueName: string;
};
export type IQueueProviderAddOutput = {
  id: string;
};
export type QueueBodyType = JsonType | JsonType[];

type JsonType = Object | string | number | boolean | null;

export type IQueueProviderCreateQueueInput = {
  queueName: string;
};

export type IQueueProviderCreateQueueOutput = {
  url: string;
};

export type IQueueProviderCheckQueueExistsInput = {
  queueName: string;
};

interface Events {
  response_processed: [];
  empty: [];
  message_received: [SQS.Message];
  message_processed: [SQS.Message];
  error: [Error, void | SQS.Message | SQS.Message[]];
  timeout_error: [Error, SQS.Message];
  processing_error: [Error, SQS.Message];
  stopped: [];
}
export declare class IConsumer extends Consumer {}
