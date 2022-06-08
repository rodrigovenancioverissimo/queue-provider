import createQueueFactory from '../../factories/createQueueFactory';
import SQS from 'aws-sdk/clients/sqs';
import faker from '@faker-js/faker';
import sendMessageFactory from '../../factories/sendMessageFactory';
import IQueueProvider from '../../IQueueProvider';
import QueueSqsProvider from './QueueSqsProvider';
jest.mock('aws-sdk/clients/sqs');

let queueProvider: IQueueProvider;

describe('QueueSqsProvider', () => {
  beforeAll(async () => {
    queueProvider = new QueueSqsProvider();
  });

  describe('sendMessage', () => {
    describe('errors', () => {
      test('when message body is too big', async () => {
        await expect(
          queueProvider.sendMessage(
            sendMessageFactory({ body: 'a'.repeat(256 * 1024 + 1) })
          )
        ).rejects.toThrow('Message size is too big');
      });
      test('when invalid params', async () => {
        SQS.prototype.sendMessage = jest
          .fn()
          .mockReturnValue({ promise: () => Promise.resolve({}) });
        await expect(
          queueProvider.sendMessage(
            sendMessageFactory({ queueName: 'queue name invalid' })
          )
        ).rejects.toThrow('Not able to send message');
      });
    });
  });
  describe('createQueue', () => {
    describe('errors', () => {
      test('when invalid queueName', async () => {
        SQS.prototype.createQueue = jest
          .fn()
          .mockReturnValue({ promise: () => Promise.resolve({}) });
        await expect(
          queueProvider.createQueue(
            createQueueFactory({ queueName: 'invalid queue name' })
          )
        ).rejects.toThrow('Not able to create queue');
      });
    });
  });
  describe('checkQueueExists', () => {
    describe('happy way', () => {
      test('when exist queue', async () => {
        const queueName = 'queue-name';
        SQS.prototype.listQueues = jest.fn().mockReturnValue({
          promise: () =>
            Promise.resolve({ QueueUrls: [`http://fake.url/${queueName}`] }),
        });
        const result = await queueProvider.checkQueueExists({ queueName });
        expect(result).toBeTruthy();
      });
      test('when not exists queue', async () => {
        const queueName = faker.datatype.string();
        SQS.prototype.listQueues = jest.fn().mockReturnValue({
          promise: () => Promise.resolve({ QueueUrls: undefined }),
        });
        expect(await queueProvider.checkQueueExists({ queueName })).toBeFalsy();
      });
    });
  });
});
