export type QueueInMemory = {
  url: string;
  messages: {
    body: string;
    id: string;
  }[];
};
