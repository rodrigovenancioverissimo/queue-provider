import createQueueFactory from '../../factories/createQueueFactory';
import QueueSqsProvider from './QueueSqsProvider';
import IQueueProvider from '../../IQueueProvider';
import { Consumer } from 'sqs-consumer';
import faker from '@faker-js/faker';

let queueProvider: IQueueProvider;
const queueName = 'queue-name';
describe('QueueSqsProvider', () => {
  beforeAll(() => {
    queueProvider = new QueueSqsProvider();
  });

  it('should be able to create a new queue', async () => {
    const queueNameTest = faker.word.noun();
    const queue = await queueProvider.createQueue(
      createQueueFactory({ queueName: queueNameTest })
    );
    expect(queue).toHaveProperty('url');
    await queueProvider.deleteQueue({ queueName: queueNameTest });
  });

  it('should be able to send a message', async () => {
    await queueProvider.createQueue(createQueueFactory({ queueName }));
    const message = await queueProvider.sendMessage({
      body: {},
      queueName,
    });
    expect(message).toHaveProperty('id');
  });

  it('should be able to create a consumer', async () => {
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
