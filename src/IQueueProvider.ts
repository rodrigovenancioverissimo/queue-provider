import SQS from 'aws-sdk/clients/sqs';

interface IQueueProvider {
  sendMessage(params: IQueueProviderAddInput): Promise<IQueueProviderAddOutput>;
  createQueue(
    params: IQueueProviderCreateQueueInput
  ): Promise<IQueueProviderCreateQueueOutput>;
  checkQueueExists(
    params: IQueueProviderCheckQueueExistsInput
  ): Promise<boolean>;
  createConsumer(
    params: IQueueProviderCreateConsumerInput
  ): Promise<ConsumerIGD>;
}

export default IQueueProvider;

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
export declare class ConsumerIGD {
  start(): void;
  stop(): void;
  on<T extends keyof Events>(
    event: T,
    listener: (...args: Events[T]) => void
  ): this;
  get isRunning(): boolean;
  static create(options: any): ConsumerIGD;
  numberOfMessages(): Promise<number>;
}
