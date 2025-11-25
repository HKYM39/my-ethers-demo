import { MessageStored as MessageStoredEvent } from "../generated/MessageStore/MessageStore"
import { MessageStored } from "../generated/schema"

export function handleMessageStored(event: MessageStoredEvent): void {
  let entity = new MessageStored(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.message = event.params.message
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
