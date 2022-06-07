import IQueueProvider, {
  ConsumerIGD,
  IQueueProviderAddInput,
  IQueueProviderAddOutput,
  IQueueProviderCheckQueueExistsInput,
  IQueueProviderCreateConsumerInput,
  IQueueProviderCreateQueueInput,
  IQueueProviderCreateQueueOutput,
} from '../../IQueueProvider';
import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { QueueInMemory } from './IQueueInMemory';
import ConsumerInMemory from './ConsumerInMemory';
import AppError from '../../exceptions/AppError';

class QueueInMemoryProvider implements IQueueProvider {
  private queues: { [key: string]: QueueInMemory } = {};

  async createConsumer({
    queueName,
    handleMessage,
  }: IQueueProviderCreateConsumerInput): Promise<ConsumerIGD> {
    const queue = this.queues[queueName];
    if (!queue) {
      throw new AppError({
        message: `Queue not found`,
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    const consumer = new ConsumerInMemory(queue, handleMessage);
    return consumer;
  }

  async sendMessage({
    body,
    queueName,
  }: IQueueProviderAddInput): Promise<IQueueProviderAddOutput> {
    const queue = this.queues[queueName];
    if (!queue) throw new AppError({ message: 'Queue not found' });
    const messageBody = JSON.stringify(body);
    if (Buffer.byteLength(messageBody) > 256 * 1024)
      throw new AppError({ message: 'Message size is too big' });
    const id = randomUUID();
    queue.messages.push({ body: messageBody, id });
    return { id };
  }

  async createQueue({
    queueName,
  }: IQueueProviderCreateQueueInput): Promise<IQueueProviderCreateQueueOutput> {
    const url = `http://fakeEndpoint.local/fakeId/${queueName}`;
    this.queues[queueName] = { url, messages: [] };
    return {
      url,
    };
  }

  async checkQueueExists({
    queueName,
  }: IQueueProviderCheckQueueExistsInput): Promise<boolean> {
    const queue = this.queues[queueName];
    return !!queue;
  }
}

export default QueueInMemoryProvider;
