import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { MessageStored } from "../generated/schema"
import { MessageStored as MessageStoredEvent } from "../generated/MessageStore/MessageStore"
import { handleMessageStored } from "../src/message-store"
import { createMessageStoredEvent } from "./message-store-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let message = "Example string value"
    let timestamp = BigInt.fromI32(234)
    let newMessageStoredEvent = createMessageStoredEvent(
      sender,
      message,
      timestamp
    )
    handleMessageStored(newMessageStoredEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("MessageStored created and stored", () => {
    assert.entityCount("MessageStored", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "MessageStored",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "MessageStored",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "message",
      "Example string value"
    )
    assert.fieldEquals(
      "MessageStored",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
