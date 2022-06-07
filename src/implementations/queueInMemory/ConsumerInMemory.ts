import {
  ConsumerIGD,
  IQueueProviderCreateConsumerInputHandlerMessage,
} from '../../IQueueProvider';
import { QueueInMemory } from './IQueueInMemory';

class ConsumerInMemory implements ConsumerIGD {
  private _queue: QueueInMemory;
  private _HandlerMessage: IQueueProviderCreateConsumerInputHandlerMessage;
  private _isRunning: boolean;

  constructor(
    queue: QueueInMemory,
    HandlerMessage: IQueueProviderCreateConsumerInputHandlerMessage
  ) {
    this._queue = queue;
    this._HandlerMessage = HandlerMessage;
    this._isRunning = false;
  }

  start() {
    this._isRunning = true;
    this.consume();
  }
  stop() {
    this._isRunning = false;
  }
  on() {
    // TODO: Implement
    return this;
  }
  get isRunning() {
    return this._isRunning;
  }
  async numberOfMessages() {
    return this._queue.messages.length;
  }

  private async consume() {
    while (this._isRunning) {
      const message = this._queue.messages.shift();
      if (!message) break;
      await this._HandlerMessage({ Body: message.body });
    }
  }
}

export default ConsumerInMemory;
