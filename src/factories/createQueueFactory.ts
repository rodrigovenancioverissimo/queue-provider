import faker from '@faker-js/faker';

export default (
  factory: {
    queueName?: string;
  } = {}
) => {
  const queueName = factory.queueName || faker.lorem.word();

  return {
    queueName,
  };
};
