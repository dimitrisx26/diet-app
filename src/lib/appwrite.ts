import { Client, Account } from 'appwrite';

export const client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('diet-assist');

export const account = new Account(client);
export { ID } from 'appwrite';
