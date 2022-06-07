import { container } from 'tsyringe';
import { ConsumerIGD } from '../../IQueueProvider';
import QueueProvider from '../..';

describe('ConsumerSqs', () => {
  let queueProvider: QueueProvider;
  let consumer: ConsumerIGD;

  beforeAll(async () => {
    container.registerSingleton(QueueProvider);
    queueProvider = container.resolve(QueueProvider);
    await queueProvider.createQueue({
      queueName: 'test',
    });
    consumer = await queueProvider.createConsumer({
      queueName: 'test',
      handleMessage: jest.fn(),
    });
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  it('should start', () => {
    consumer.start();
    expect(consumer.isRunning).toBeTruthy();
  });

  it('should stop', () => {
    consumer.start();
    consumer.stop();
    expect(consumer.isRunning).toBeFalsy();
  });

  it('should count messages', async () => {
    const numberOfMessages = await consumer.numberOfMessages();
    expect(typeof numberOfMessages).toBe('number');
  });

  // TODO: Não está consumindo mensagens
  // it('should consume', async () => {
  //   consumer.stop();
  //   await queueProvider.sendMessage({
  //     queueName: 'test',
  //     body: 'test',
  //   });
  //   expect(await consumer.numberOfMessages()).toBeGreaterThan(0);
  //   consumer.start();
  //   while ((await consumer.numberOfMessages()) > 0) {
  //     await sleep({ ms: 100 });
  //   }
  //   consumer.stop();
  //   expect('Number of Messages is Zero').toBeTruthy();
  // });
});
