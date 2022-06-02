// exports.handler = async (event) => {


var { MailListener } = require("mail-listener6");   

var axios= require('axios')


var mailListener = new MailListener({
  username: "satyavermaofficial@gmail.com",
  password: "rfsayxgoxzoijmvw",
  host: "imap.gmail.com",
  port: 993, // imap port
  tls: true,
  connTimeout: 10000, // Default by node-imap
  keepAlive:true,
  authTimeout: 10000, // Default by node-imap,
  debug: console.log, // Or your custom function with only one incoming argument. Default: null
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
//   attachments: true, // download attachments as they are encountered to the project directory
//   attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
});

mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});


mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});


mailListener.on("mail",async function(mail, seqno) {
  // do something with the whole email as a single object
  var data= mail.headers.get("from")
  var todata=mail.headers.get("to")
  var date=mail.date


//   console.log(mail.attachments[0].content.toString("base64"))
 var file=mail.attachments[0].content.toString("base64") || ''
var datx={"sender_name":data.value[0].name,"sender_mail":data.value[0].address,"receiver_mail":todata.value[0].address,"time":date,"file":file}
await axios.post("https://ap-south-1.aws.data.mongodb-api.com/app/contrato-invc-cofeu/endpoint/hook/save/email/attachment",datx)
})



   
// };
