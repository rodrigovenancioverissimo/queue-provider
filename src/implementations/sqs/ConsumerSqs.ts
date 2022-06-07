import AppError from '../../exceptions/AppError';
import SQS from 'aws-sdk/clients/sqs';
import { Consumer } from 'sqs-consumer';
import { ConsumerIGD } from '../../IQueueProvider';

export default class ConsumerSqs extends Consumer implements ConsumerIGD {
  private _sqs;
  private _queueUrl: string;

  constructor(options: IConsumerSqs) {
    super(options);
    this._sqs = options.sqs;
    this._queueUrl = options.queueUrl;
  }

  async numberOfMessages(): Promise<number> {
    const { Attributes } = await this._sqs
      .getQueueAttributes({
        QueueUrl: this._queueUrl,
        AttributeNames: ['ApproximateNumberOfMessages'],
      })
      .promise();
    if (
      Attributes === undefined ||
      !Attributes.hasOwnProperty('ApproximateNumberOfMessages')
    )
      throw new AppError({ message: 'Could not get number of messages' });
    return parseInt(Attributes.ApproximateNumberOfMessages, 10);
  }

  static create(options: IConsumerSqs): ConsumerSqs {
    return new ConsumerSqs(options);
  }
}

type IConsumerSqs = {
  queueUrl: string;
  handleMessage: (message: SQS.Message) => Promise<void>;
  sqs: SQS;
};
