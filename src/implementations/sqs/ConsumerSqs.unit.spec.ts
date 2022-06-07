import SQS from 'aws-sdk/clients/sqs';
import ConsumerSqs from './ConsumerSqs';

describe('ConsumerSqs', () => {
  it('should be defined', () => {
    expect(ConsumerSqs).toBeDefined();
  });

  describe('errors', () => {
    let sqs: unknown;
    beforeAll(() => {
      sqs = {
        getQueueAttributes: jest.fn().mockReturnValue({
          promise: () => Promise.resolve({ Attributes: {} }),
        }),
      };
    });

    test('when Attributes not found', async () => {
      const consumer = ConsumerSqs.create({
        queueUrl: 'http://url',
        handleMessage: (m) => Promise.resolve(),
        sqs: sqs as SQS,
      });
      await expect(consumer.numberOfMessages()).rejects.toThrow(
        'Could not get number of messages'
      );
    });
  });
});
