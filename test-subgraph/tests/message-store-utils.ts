import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { MessageStored } from "../generated/MessageStore/MessageStore"

export function createMessageStoredEvent(
  sender: Address,
  message: string,
  timestamp: BigInt
): MessageStored {
  let messageStoredEvent = changetype<MessageStored>(newMockEvent())

  messageStoredEvent.parameters = new Array()

  messageStoredEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  messageStoredEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromString(message))
  )
  messageStoredEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return messageStoredEvent
}
