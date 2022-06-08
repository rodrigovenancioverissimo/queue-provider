import createQueueFactory from '../../factories/createQueueFactory';
import QueueInMemoryProvider from './QueueInMemoryProvider';
import IQueueProvider from '../../IQueueProvider';
import sendMessageFactory from '../../factories/sendMessageFactory';
import ConsumerInMemory from './ConsumerInMemory';

let queueProvider: IQueueProvider;
describe('QueueInMemoryProvider', () => {
  beforeAll(() => {
    queueProvider = new QueueInMemoryProvider();
  });
  describe('sendMessage', () => {
    describe('happy way', () => {
      it('should be able send a message', async () => {
        const queueName = 'queue-name';
        await queueProvider.createQueue(createQueueFactory({ queueName }));
        const message = await queueProvider.sendMessage({
          body: {},
          queueName,
        });
        expect(message).toHaveProperty('id');
      });
    });
    describe('errors', () => {
      test('when message body is too big', async () => {
        const queueName = 'queue-name';
        await queueProvider.createQueue(createQueueFactory({ queueName }));
        await expect(
          queueProvider.sendMessage(
            sendMessageFactory({ queueName, body: 'a'.repeat(256 * 1024 + 1) })
          )
        ).rejects.toThrow('Message size is too big');
      });
      test('when queue not exists', async () => {
        await expect(
          queueProvider.sendMessage(
            sendMessageFactory({ queueName: 'queue-name-fake' })
          )
        ).rejects.toThrow('Queue not found');
      });
    });
  });
  describe('createQueue', () => {
    describe('happy way', () => {
      it('should be able to create a new queue', async () => {
        const queue = await queueProvider.createQueue(createQueueFactory());
        expect(queue).toHaveProperty('url');
      });
    });
  });
  describe('checkQueueExists', () => {
    describe('happy way', () => {
      it('should be able to check if queue exists', async () => {
        const queueName = 'queue-name';
        await queueProvider.createQueue(createQueueFactory({ queueName }));
        const result = await queueProvider.checkQueueExists({ queueName });
        expect(result).toBeTruthy();
      });
    });
  });
  describe('createConsumer', () => {
    describe('happy way', () => {
      it('should be able to create a new consumer', async () => {
        const queueName = 'queue-name';
        await queueProvider.createQueue(createQueueFactory({ queueName }));
        const consumer = await queueProvider.createConsumer({
          queueName,
          handleMessage: async () => {
            return;
          },
        });
        expect(consumer).toBeInstanceOf(ConsumerInMemory);
      });
    });
    describe('errors', () => {
      test('when queue not exists', async () => {
        await expect(
          queueProvider.createConsumer({
            queueName: 'queue-name-fake',
            handleMessage: async () => {
              return;
            },
          })
        ).rejects.toThrow('Queue not found');
      });
    });
  });
});
