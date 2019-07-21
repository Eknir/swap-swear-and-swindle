const {
  BN,
  balance,
  time,
  expectRevert,
  constants,
  expectEvent
} = require("openzeppelin-test-helpers");


const { signCheque } = require("./swutils");

const { expect } = require('chai');

function shouldReturnDEFAULT_HARDDEPPOSIT_DECREASE_TIMEOUT() {

}

function shouldReturnCheques(beneficiary, expectedSerial, expectedAmount, expectedPaidOut, expectedCashTimeout) {

}

function shouldReturnHarddeposits(beneficiary, expectedAmount, expectedDecreaseTimeout, expectedCanBeDecreasedAt) {

}

function shouldReturnTotalharddeposit(expectedHardDeposit) {

}

function shouldReturnIssuer(expectedIssuer) {

}

function shouldReturnLiquidBalance(expectedLiquidBalance) {

}

function shouldReturnLiquidBalanceFor(beneficiary, expectedLiquidBalance) {

}

function submitChequeInternal() {
  beforeEach(async function() {
    this.currentCheque = await this.simpleSwap.cheques(this.signedCheque.beneficiary)
  })
  it('should update the cheque serial number', async function() {
    expect(this.currentCheque.serial).bignumber.is.equal(this.signedCheque.serial, "serial was not updated")
  })
  it('should update the cheque amount', async function() {
    expect(this.currentCheque.amount).bignumber.is.equal(this.signedCheque.amount, "amount was not updated")
  })
  it('should update the cheque timeout', async function() {
    expect(parseInt(this.currentCheque.cashTimeout)).is.equal(parseInt(await time.latest()) + parseInt(this.signedCheque.timeout))
  })
  it('should emit a chequeSubmitted event', async function() {
    expectEvent.inLogs(this.logs, "ChequeSubmitted", {
      amount: this.signedCheque.amount,
      beneficiary: this.signedCheque.beneficiary,
      serial: this.signedCheque.serial
    })
  })
}

function shouldSubmitChequeIssuer(unsignedCheque, from) {
  beforeEach(async function() {
    this.preconditions = {
      cheque: await this.simpleSwap.cheques(unsignedCheque.beneficiary)
    }
    this.signedCheque = await signCheque(this.simpleSwap, unsignedCheque)
    const { logs } = await this.simpleSwap.submitChequeissuer(this.signedCheque.beneficiary, this.signedCheque.serial, this.signedCheque.amount, this.signedCheque.timeout, this.signedCheque.signature, {from: from})
    this.logs = logs
  })
  submitChequeInternal() 
}

function shouldNotSubmitChequeIssuer(unsignedCheque, from, revertMessage) {
  beforeEach(async function() {
    this.signedCheque = await signCheque(this.simpleSwap, unsignedCheque)
  })
  it('reverts', async function() {
    await expectRevert(this.simpleSwap.submitChequeissuer(
      this.signedCheque.beneficiary,
      this.signedCheque.serial, 
      this.signedCheque.amount, 
      this.signedCheque.timeout,
      this.signedCheque.signature, {from: from}), revertMessage)
  })
}

function shouldSubmitChequeBeneficiary(unsignedCheque, from) {
  beforeEach(async function() {
    this.preconditions = {
      cheque: await this.simpleSwap.cheques(unsignedCheque.beneficiary)
    }
    this.signedCheque = await signCheque(this.simpleSwap, unsignedCheque)
    const { logs } = await this.simpleSwap.submitChequeBeneficiary(this.signedCheque.serial, this.signedCheque.amount, this.signedCheque.timeout, this.signedCheque.signature, {from: from})
    this.logs = logs
  })
  submitChequeInternal() 
}
function shouldNotSubmitChequeBeneficiary(unsignedCheque, from, revertMessage) {
  beforeEach(async function() {
    this.signedCheque = await signCheque(this.simpleSwap, unsignedCheque)
  })
  it('reverts', async function() {
    await expectRevert(this.simpleSwap.submitChequeBeneficiary(
      this.signedCheque.serial, 
      this.signedCheque.amount, 
      this.signedCheque.timeout,
      this.signedCheque.signature, {from: from}), revertMessage)
  })

}
function shouldSubmitCheque(unsignedCheque, from) {
  beforeEach(async function() {
    this.preconditions = {
      cheque: await this.simpleSwap.cheques(unsignedCheque.beneficiary)
    }
    this.signedCheque = await signCheque(this.simpleSwap, unsignedCheque)
    const { logs } = await this.simpleSwap.submitCheque(
      this.signedCheque.beneficiary, 
      this.signedCheque.serial, 
      this.signedCheque.amount, 
      this.signedCheque.timeout, 
      this.signedCheque.signature.issuer, 
      this.signedCheque.signature.beneficiary, 
      {from: from}
    )
    this.logs = logs
  })
  submitChequeInternal() 
}
function shouldNotSubmitCheque(unsignedCheque, from, revertMessage) {
  beforeEach(async function() {
    this.signedCheque = await signCheque(this.simpleSwap, unsignedCheque)
  })
  it('reverts', async function() {
    await expectRevert(this.simpleSwap.submitCheque(
      this.signedCheque.beneficiary, 
      this.signedCheque.serial, 
      this.signedCheque.amount, 
      this.signedCheque.timeout, 
      this.signedCheque.signature.issuer, 
      this.signedCheque.signature.beneficiary, {from: from}), revertMessage)
  })
}
function cashChequeInternal(beneficiaryPrincipal, beneficiaryAgent, requestPayout, beneficiarySig, expiry, calleePayout, from) {
  it('should update the harddeposit usage', function() {
    //TODO => minor importance
  })
  it('should update paidOut', async function() {
    expect((await this.simpleSwap.cheques(benefciaryPrincipal)).paidOut).bignumber.to.be.equal(this.currentCheque.paidOut.add(amount).add(calleepayout), "Did not update paidOut")
  })
  it('should transfer the correct amount to the beneficiaryAgent', async function() {
    expect(await balance.current(beneficiaryAgent)).bignumber.to.be.equal(this.currentBeneficiaryBalance.add(amount).sub(calleepayout).sub(await computeCost(this.receipt)))
  })
  it('should emit a ChequeCashed event', function() {
    expectEvent.inLogs(this.logs, "ChequeCashed", {
      beneficiaryPrincipal: benefciaryPrincipal,
      beneficiaryAgent: beneficiaryAgent,
      callee: benefciaryPrincipal,
      serial: this.currentCheque.serial,
      totalPayout: this.currentCheque.amount,
      requestPayout: this.currentCheque.amount,
      calleePayout: new BN(0)
    })
  })
  it('should emit a ChequeBounced event', function() {
    //TODO => less important => only if there is no balance
  })
}
function shouldCashChequeBeneficiary(beneficiaryAgent, requestPayout, from) {

}
function shouldNotCashChequeBeneficiary(beneficiaryAgent, requestPayout, from, revertMessage) {

}
function shouldCashCheque(beneficiaryPrincipal, beneficiaryAgent, requestPayout, beneficiarySig, expiry, calleePayout, from) {

}
function shouldNotCashCheque(beneficiaryPrincipal, beneficiaryAgent, requestPayout, beneficiarySig, expiry, calleePayout, from, revertMessage) {

}
function shouldPrepareDecreaseHardDeposit(beneficiary, decreaseAmount, from) {
  beforeEach(async function() {
    await this.simpleSwap.send(amount)
    await this.simpleSwap.increaseHardDeposit(beneficiary, amount)

    let { logs } = await this.simpleSwap.prepareDecreaseHardDeposit(
      beneficiary,
      amount, {
        from: issuer
      }
    )

    this.logs = logs
    this.timeout = (await this.simpleSwap.hardDeposits(beneficiary))[2]
  })

  it('should fire the HardDepositDecreasePrepared event', function() {
    expectEvent.inLogs(this.logs, 'HardDepositDecreasePrepared', {
      beneficiary,
      decreaseAmount: amount
    })
  })

  it('should set the decreaseAmount', async function() {
    expect((await this.simpleSwap.hardDeposits(beneficiary))[1]).bignumber.is.equal(amount)
  })

  it('should set the canBeDecreasedAt', async function() {
    expect((await this.simpleSwap.hardDeposits(beneficiary))[3]).bignumber.is.gte((await time.latest()).add(this.timeout))
  })

}
function shouldNotPrepareDecreaseHardDeposit(beneficiary, decreaseAmount, from, revertMessage) {

}
function shouldDecreaseHardDeposit(beneficiary, from) {

}
function shouldNotDecreaseHardDeposit(beneficiary, from, revertMessage) {

}
function shouldIncreaseHardDeposit(beneficiary, amount, from) {

}
function shouldNotIncreaseHardDeposit(beneficiary, amount, from, revertMessage) {

}
function shouldSetCustomHardDepositDecreaseTimeout(beneficiary, decreaseTimeout, beneficiarySig, from) {

}
function shouldNotSetCustomHardDepositDecreaseTimeout(beneficiary, decreaseTimeout, beneficiarySig, from, revertMessage) {

}

function shouldWithdraw(amount, from) {

}
function shouldNotWithdraw(amount, from, revertMessage) {

}

function shouldDeposit(amount, from) {
  beforeEach(async function() {
    this.preconditions = {
      balance: await balance.current(this.simpleSwap.address),
      totalHardDeposit: await this.simpleSwap.totalHardDeposit(),
      liquidBalance: await this.simpleSwap.liquidBalance()
    }
    const { logs } = await this.simpleSwap.send(amount, {from: from})
    this.logs = logs
  })
  it('should update the liquidBalance of the checkbook', async function() {
    expect(await this.simpleSwap.liquidBalance()).bignumber.to.equal(this.preconditions.liquidBalance.add(amount))
  })
  it('should update the balance of the checkbook', async function() {
    expect(await balance.current(this.simpleSwap.address)).bignumber.to.equal(this.preconditions.balance.add(amount))
  })
  it('should not afect the totalHardDeposit', async function() {
    expect(await this.simpleSwap.totalHardDeposit()).bignumber.to.equal(this.preconditions.totalHardDeposit)
  })
  it('should emit a deposit event', async function() {
    expectEvent.inLogs(this.logs, "Deposit", {
      depositor: from,
      amount: amount
    })
  })
}

module.exports = {
  shouldReturnDEFAULT_HARDDEPPOSIT_DECREASE_TIMEOUT,
  shouldReturnCheques,
  shouldReturnHarddeposits,
  shouldReturnTotalharddeposit,
  shouldReturnIssuer,
  shouldReturnLiquidBalance,
  shouldReturnLiquidBalanceFor,
  shouldSubmitChequeIssuer,
  shouldNotSubmitChequeIssuer,
  shouldSubmitChequeBeneficiary,
  shouldNotSubmitChequeBeneficiary,
  shouldSubmitCheque,
  shouldNotSubmitCheque,
  shouldCashChequeBeneficiary,
  shouldNotCashChequeBeneficiary,
  shouldCashCheque,
  shouldNotCashCheque,
  shouldPrepareDecreaseHardDeposit,
  shouldNotPrepareDecreaseHardDeposit,
  shouldDecreaseHardDeposit,
  shouldNotDecreaseHardDeposit,
  shouldIncreaseHardDeposit,
  shouldNotIncreaseHardDeposit,
  shouldSetCustomHardDepositDecreaseTimeout,
  shouldNotSetCustomHardDepositDecreaseTimeout,
  shouldWithdraw,
  shouldNotWithdraw,
  shouldDeposit
}

