import IQueueProvider, { IConsumer } from '../../IQueueProvider';
import QueueSqsProvider from './QueueSqsProvider';
import sleep from '../../utils/sleep';

describe('ConsumerSqs', () => {
  let queueProvider: IQueueProvider;
  let consumer: IConsumer;
  const queueName = 'queue-name';

  beforeAll(async () => {
    queueProvider = new QueueSqsProvider();
    await queueProvider.createQueue({
      queueName,
    });
    consumer = await queueProvider.createConsumer({
      queueName,
      handleMessage: jest.fn(),
    });
  });

  afterAll(async () => {
    consumer.stop();
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  it('should start', () => {
    consumer.start();
    expect(consumer.isRunning).toBeTruthy();
  });

  it('should stop', () => {
    consumer.stop();
    expect(consumer.isRunning).toBeFalsy();
  });

  // it('should consume', async () => {
  //   consumer.stop();
  //   await queueProvider.sendMessage({
  //     queueName,
  //     body: 'test',
  //   });
  //   const callback = jest.fn();
  //   consumer.on('message_processed', (message) => callback(message));
  //   // consumer.start();
  //   await sleep({ ms: 3000 });
  //   expect(callback).toHaveBeenCalled();
  //   consumer.stop();
  // });
});
