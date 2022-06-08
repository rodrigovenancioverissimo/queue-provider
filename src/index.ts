import IQueueProvider from './IQueueProvider';
import QueueProvider from './implementations/sqs/QueueSqsProvider';
import QueueInMemoryProvider from './implementations/queueInMemory/QueueInMemoryProvider';

export default QueueProvider;
export {
  IQueueProvider,
  QueueProvider,
  QueueProvider as QueueSqsProvider,
  QueueInMemoryProvider,
};
