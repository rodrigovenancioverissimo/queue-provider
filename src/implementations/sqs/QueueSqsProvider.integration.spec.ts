import createQueueFactory from '../../factories/createQueueFactory';
import { container } from 'tsyringe';
import QueueSqsProvider from './QueueSqsProvider';
import IQueueProvider from '../../IQueueProvider';
import { Consumer } from 'sqs-consumer';

let queueProvider: IQueueProvider;
describe('QueueSqsProvider', () => {
  beforeAll(() => {
    container.registerSingleton<IQueueProvider>(
      'QueueProvider',
      QueueSqsProvider
    );
    queueProvider = container.resolve('QueueProvider');
  });
  it('should be able to create a new queue', async () => {
    const queue = await queueProvider.createQueue(createQueueFactory());
    expect(queue).toHaveProperty('url');
  });

  it('should be able to send a message', async () => {
    const queueName = 'queue-name';
    await queueProvider.createQueue(createQueueFactory({ queueName }));
    const message = await queueProvider.sendMessage({
      body: {},
      queueName,
    });
    expect(message).toHaveProperty('id');
  });

  it('should be able to create a consumer', async () => {
    const queueName = 'queue-name';
    await queueProvider.createQueue(createQueueFactory({ queueName }));
    const consumer = await queueProvider.createConsumer({
      queueName,
      handleMessage: async (message) => {
        console.log(message);
      },
    });
    expect(consumer).toBeInstanceOf(Consumer);
  });
});
