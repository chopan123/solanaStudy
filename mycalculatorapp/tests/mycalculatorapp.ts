const assert = require('assert')
const anchor = require('@project-serum/anchor')
const {SystemProgram} = anchor.web3

describe('mycalculatorapp', ()=> {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider)
  // console.log("provider:", provider)
  const calculator = anchor.web3.Keypair.generate()
  // console.log("anchor workspace:", anchor.workspace)
  const program = anchor.workspace.Mycalculatorapp
  it('Creates a calculator', async () => {
    // function of the program writen in lib.rs
    await program.rpc.create('Welcome to Solana', {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [calculator]
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.greeting === "Welcome to Solana")
  })

  it('Adds two numbers', async() => {
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(5)))
  })
  it('Substracts two numbers', async() =>{
    await program.rpc.substract(new anchor.BN(3), new anchor.BN(2),{
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(1)))
  })
  it('Multiplies two numbers', async() =>{
    await program.rpc.multiplication(new anchor.BN(3), new anchor.BN(2),{
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(6)))
  })
  it('Divides two numbers', async() =>{
    await program.rpc.division(new anchor.BN(3), new anchor.BN(2),{
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(1)))
    assert.ok(account.remainder.eq(new anchor.BN(1)))
  })
})
