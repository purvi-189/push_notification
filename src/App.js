import { sendNotification, channels } from "@pushprotocol/restapi";
import * as PushAPI from "@pushprotocol/restapi";
import "./App.css";

const ethers = require("ethers");
const PK = "3db2399f1e5ad6cf43f37377f6595009dad0abd7e672041dac62a7a20e050fbc";
const Pkey = `0x${PK}`;
const mysigner = new ethers.Wallet(Pkey);
const userAddresses = [
  "eip155:5:0xD50FB5Aa147Aa9cdb3F59AB22F3bd5d7bcc95339",
  "eip155:5:0x3013bb4E03a7B81106D69C10710EaE148C8410E1", ];

function App() {

  const channelDetails = async () => {
    const subscriptions = await PushAPI.user.getSubscriptions({
      user: 'eip155:5:0x3013bb4E03a7B81106D69C10710EaE148C8410E1', // user address in CAIP
      env: 'staging'
    });
  
    const channels = subscriptions.map((subscription) => subscription.channel);
    console.log(channels);
  
    const channelAddress = "0xF9da412Cc753e3E18E6428286b5677C0E301BE3d";
  
    if (channels.includes(channelAddress)) {
      console.log("User already opted in");
    }
  }
    
  const welcomeNotification = async () => {
    try {
      const apiResponse = await sendNotification({
        signer: mysigner,
        type: 4, // target
        identityType: 2, // direct payload
        notification: {
          title: `[SDK-TEST] notification TITLE:`,
          body: `[sdk-test] notification BODY`,
        },
        payload: {
          title: `[sdk-test] Welcome`,
          body: `sample welcome to our app`,
          cta: "",
          img: "",
        },

        recipients: userAddresses,
        channel: "eip155:5:0xF9da412Cc753e3E18E6428286b5677C0E301BE3d", // your channel address
        env: "staging",
        onSuccess: () => {
          console.log("welcome Notification Sent");
        },
        onError: () => {
          console.error("An error occurred while sending welcome notification");
        },
      });
    } 
    catch (error) {
      console.error("Error:", error);
        }
        console.log(welcomeNotification);
  };

  const optInChannel = async () => {
    try {
    await channels.subscribe({
      signer: mysigner,
      channelAddress: "eip155:5:0xF9da412Cc753e3E18E6428286b5677C0E301BE3d", // channel address in CAIP
      userAddress :  userAddresses,
       // user address in CAIP
      onSuccess: () => {
        console.log("opt in success");
        welcomeNotification();
      },
      onError: () => {
        console.error("opt in error");
      },
      env: "staging",
    });
    } catch (error) {
      console.error("Error:", error);
        }
        // console.log();
  };

/// send notification

const sendNotification = async () => {
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer: mysigner,
        type: 4, // subset
        identityType: 2, // direct payload
        notification: {
          title: `[SDK-TEST] notification TITLE:`,
          body: `[sdk-test] notification BODY`
        },
        payload: {
          title: `[sdk-test] message`,
          body: `You are added to `,
          cta: '',
          img: ''
        },
        recipients:userAddresses , // recipients addresses
        channel: 'eip155:5:0xF9da412Cc753e3E18E6428286b5677C0E301BE3d', // your channel address
        env: 'staging',
        onSuccess: () => {
          console.log("Notification Sent");
        },
        onError: () => {
          console.error("An error occurred while sending the notification");
        },
      });
      console.log(apiResponse);
    } 
    catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">

      <h1>Push Demo</h1>

      <div className="optinButton">
        <button onClick={() => optInChannel()}>OptIN</button>
      </div>

      <div className="chennelfilter">
        <button onClick={() => channelDetails()}>chennelDetails</button>
      </div>
      <div className="sendButton">
        <button onClick={() => sendNotification()}>send</button>
      </div>

    </div>
  );
}

export default App;

