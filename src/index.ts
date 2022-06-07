import QueueProvider from './implementations/sqs/QueueSqsProvider';
import QueueInMemoryProvider from './implementations/queueInMemory/QueueInMemoryProvider';

export default QueueProvider;
export {
  QueueProvider,
  QueueProvider as QueueSqsProvider,
  QueueInMemoryProvider,
};
