import { MessageStored } from "../generated/MessageStore/MessageStore";
import { MessageStoredEvent } from "../generated/schema";

export function handleMessageStored(event: MessageStored): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let entity = new MessageStoredEvent(id);

  entity.sender = event.params.sender;
  entity.message = event.params.message;
  entity.timestamp = event.params.timestamp;

  entity.save();
}
