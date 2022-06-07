import sleep from '../../utils/sleep';
import { IQueueProviderCreateConsumerInputHandlerMessage } from '../../IQueueProvider';
import ConsumerInMemory from './ConsumerInMemory';
import { QueueInMemory } from './IQueueInMemory';

describe('ConsumerInMemory', () => {
  let queue: QueueInMemory;
  let handlerMessage: IQueueProviderCreateConsumerInputHandlerMessage;
  let consumer: ConsumerInMemory;

  beforeEach(() => {
    queue = {
      url: 'http://fake.url',
      messages: [],
    };
    handlerMessage = jest.fn();
    consumer = new ConsumerInMemory(queue, handlerMessage);
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

  it('should consume', async () => {
    const message = { body: 'test', id: 'test' };
    queue.messages.push(message);
    consumer.start();
    while ((await consumer.numberOfMessages()) > 0) {
      await sleep({ ms: 10 });
    }
    expect(queue.messages).toHaveLength(0);
  });

  it('should consume all messages', async () => {
    const message1 = { body: 'test1', id: 'test1' };
    const message2 = { body: 'test2', id: 'test2' };
    queue.messages.push(message1);
    queue.messages.push(message2);
    consumer.start();
    while ((await consumer.numberOfMessages()) > 0) {
      await sleep({ ms: 10 });
    }
    expect(handlerMessage).toHaveBeenCalledWith({ Body: 'test1' });
    expect(handlerMessage).toHaveBeenCalledWith({ Body: 'test2' });
  });

  it('should listen to messages', () => {
    // TODO: Implement
    consumer.on();
  });
});
