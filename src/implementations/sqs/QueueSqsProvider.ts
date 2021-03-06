import IQueueProvider, {
  IConsumer,
  IQueueProviderAddInput,
  IQueueProviderAddOutput,
  IQueueProviderCheckQueueExistsInput,
  IQueueProviderCreateConsumerInput,
  IQueueProviderCreateQueueInput,
  IQueueProviderCreateQueueOutput,
  IQueueProviderDeleteQueueInput,
} from '../../IQueueProvider';
import SQS from 'aws-sdk/clients/sqs';
import settings from '../../settings';
import AppError from '../../exceptions/AppError';
import { Consumer } from 'sqs-consumer';

class QueueSqsProvider implements IQueueProvider {
  private client: SQS;

  constructor() {
    this.client = new SQS({
      endpoint: settings.aws.sqs.endpoint,
      credentials: {
        accessKeyId: settings.aws.credentials.accessKeyId,
        secretAccessKey: settings.aws.credentials.secretAccessKey,
      },
      region: settings.aws.region,
    });
  }

  async createConsumer({
    queueName,
    handleMessage,
  }: IQueueProviderCreateConsumerInput): Promise<IConsumer> {
    const queueUrl = this.getEndpoint(queueName);
    const consumer = Consumer.create({
      queueUrl,
      handleMessage,
      sqs: this.client,
    });
    return consumer;
  }

  /**
   * https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html
   */
  async sendMessage({
    body,
    queueName,
  }: IQueueProviderAddInput): Promise<IQueueProviderAddOutput> {
    const messageBody = JSON.stringify(body);
    if (Buffer.byteLength(messageBody) > 256 * 1024)
      throw new AppError({ message: 'Message size is too big' });
    const resp = await this.client
      .sendMessage({
        MessageBody: messageBody,
        QueueUrl: this.getEndpoint(queueName),
      })
      .promise();
    if (!resp.MessageId)
      throw new AppError({ message: 'Not able to send message' });
    return {
      id: resp.MessageId,
    };
  }

  /**
   * https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_CreateQueue.html
   */
  async createQueue({
    queueName,
  }: IQueueProviderCreateQueueInput): Promise<IQueueProviderCreateQueueOutput> {
    const resp = await this.client
      .createQueue({ QueueName: queueName })
      .promise();

    if (!resp.QueueUrl)
      throw new AppError({ message: 'Not able to create queue' });
    return { url: resp.QueueUrl };
  }

  /**
   * https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ListQueues.html
   */
  async checkQueueExists({
    queueName,
  }: IQueueProviderCheckQueueExistsInput): Promise<boolean> {
    const resp = await this.client
      .listQueues({ QueueNamePrefix: queueName })
      .promise();
    const queueUrls = resp.QueueUrls || [];
    const queueUrl = queueUrls.find(
      (url) => url.split('/').pop() === queueName
    );
    return !!queueUrl;
  }

  async deleteQueue({
    queueName,
  }: IQueueProviderDeleteQueueInput): Promise<void> {
    const resp = await this.client
      .deleteQueue({ QueueUrl: this.getEndpoint(queueName) })
      .promise();
    if (resp.$response.error)
      throw new AppError({ message: 'Not able to delete queue' });
  }

  private getEndpoint(queueName: string): string {
    return `${settings.aws.sqs.endpoint}/${settings.aws.accountId}/${queueName}`;
  }
}

export default QueueSqsProvider;
