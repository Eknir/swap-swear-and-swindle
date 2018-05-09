pragma solidity ^0.4.19;
import "../abstracts/AbstractWitness.sol";

contract HashWitness is AbstractWitness {
  event Testified(bytes32 noteId, bytes32 hash);

  mapping (bytes32 => TestimonyStatus) testimonies;

  function testimonyFor(address, address, bytes32 noteId)
  public view returns (TestimonyStatus) {
    return testimonies[noteId];
  }

  function testify(address swap, address beneficiary, uint index, uint amount, address witness, uint validFrom, uint validUntil, address trial, bytes32 hash, bytes data) public {
    bytes32 remark = keccak256(abi.encodePacked(trial, hash));

    bytes32 noteId = keccak256(abi.encodePacked(swap, index, beneficiary, amount, witness, validFrom, validUntil, remark));

    if(keccak256(data) == hash) {
      Testified(noteId, hash);
      testimonies[noteId] = TestimonyStatus.VALID;
    }
  }

}