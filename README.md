# Queue Provider

Provider inicialmente com suporte ao SQS e uma implementação em memória para fins de testes.
A ideia é reunir todas as implementações de fila em um único lugar para facilitar a manutenção. Sendo compatível com qualquer fila.

Suporte ao Node.js `14.x`, `16.x`, `18.x`.

Suporte as implementações:
- [x] SQS
- [x] QueueInMemory
- [ ] BullMQ
- [ ] RabbitMQ

## Uso
A seguir, temos um exemplo de uso do provider com SQS. A configurações até o momento são passadas via variável de ambiente.

```TypeScript
import { QueueSqsProvider } from 'queue-provider';

async function main() {
  const queueProvider = new QueueSqsProvider();
  const queueName = 'my-queue';
  await queueProvider.createQueue({ queueName });
  await queueProvider.sendMessage({ queueName, body: { key: 'value' } });
  const consumer = queueProvider.createConsumer({
    queueName,
    handleMessage: (message) => {
      console.log(message);
    },
  });
  consumer.start();
}
main();
```
