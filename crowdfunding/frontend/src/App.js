import './App.css';
import {useEffect, useState} from 'react';
import idl from "./idl.json";
import {Connection, PublicKey, clusterApiUrl} from "@solana/web3.js";
import { Program, AnchorProvider, web3, utils, BN} from "@project-serum/anchor";
import { Buffer } from 'buffer'
window.Buffer = Buffer

const programID = new PublicKey(idl.metadata.address)
const network = clusterApiUrl("devnet");
const opts = {
  preflightCommitment: "processed",
}
const {SystemProgram} = web3

const App = () => {
  const [walletAddress, setWalletAddress] =useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment)
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider
  }
  const checkIfWalletIsConnected = async () => {
    try {
      const {solana} = window;
      if(solana) {
        if(solana.isPhantom) {
          console.log("Phantom wallet found!");
          const response = await solana.connect({
            onlyIfTrusted: true
          })
          console.log(
            "Connected with public Key:",
            response.publicKey.toString()
          )
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not fount! Get a Phantom wallet")
      }
    } catch(error) {
      console.error(error)
    }
  }
  const getCampaigns = async () => {
    const connection = new Connection(network, opts.preflightCommitment)
    const provider = getProvider()
    const program = new Program(idl, programID, provider)
    Promise.all(await connection.getProgramAccounts(programID).map(
      async campaign => ({
        ...(await program.account.campaign.fetch(campaign.publicKey)),
        pubkey: campaign.pubkey,
      })
    )).then(campaigns => setCampaigns(campaigns))
  }

  const createCampaign = async () => {
    try{
      const provider = getProvider()
      const program = new Program(idl, programID, provider)
      const [campaign] = await PublicKey.findProgramAddress([
        utils.bytes.utf8.encode("CAMPAIGN_DEMO"),
        provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );
      await program.rpc.create('campaign name', "campaign description", {
        accounts: {
          campaign,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        }
      })
      console.log("created a new campaign w/ address:", campaign.toString())
    } catch(error) {
      console.error("error creating campaign account:", error)
    }
  }

  const connectWallet = async () => {
    const {solana} = window;
    if(solana) {
      const response = await solana.connect()
      console.log("Connected with public key:", response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())
    }
  }
  const renderConnectedContainer = () => (
    <>
      <button onClick={createCampaign}>create campaign</button>
      <button onClick={getCampaigns}> get campaigns</button>
      <br />
        {campaigns.map(campaign => (
          <>
            <p> Campaign ID: {campaign.pubkey.toString()} </p>
            <p> Balance: {(campaign.amountDonated / web3.LAMPORTS_PER_SOL).toString()} </p>
            <p>{campaign.name}</p>
            <p>{campaign.description}</p>
            <br />
          </>
        ))}
    </>
  )

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet}>Connect to Wallet</button>
  )

  useEffect(()=>{
    const onLoad = async() => {
      await checkIfWalletIsConnected()
    }
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener("load", onLoad)
  }, [])

  return <div className="App">
    {!walletAddress && renderNotConnectedContainer()}
    {walletAddress && renderConnectedContainer()}
    </div>;
}

export default App;
