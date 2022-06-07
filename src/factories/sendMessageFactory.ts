import faker from '@faker-js/faker';
import { QueueBodyType } from '../IQueueProvider';

export default (
  factory: {
    queueName?: string;
    body?: QueueBodyType;
  } = {}
) => {
  const queueName = factory.queueName || faker.lorem.word();
  const body = factory.body || {
    action: 'create-user',
    service: 'user-api',
    body: {
      user: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
      },
    },
  };

  return {
    queueName,
    body,
  };
};
