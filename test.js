var { MailListener } = require("mail-listener6");   // NOTE: A FUTURE VERSION (release date TBA) will not require ES6 destructuring or referring to the class after the require statement (i.e. require('mail-listener6').MailListener). At this stage, this is necessary because index.js exports the MailListener class as a property of module.exports.

var axios= require('axios')


var mailListener = new MailListener({
  username: "satyavermaofficial@gmail.com",
  password: "rfsayxgoxzoijmvw",
  host: "imap.gmail.com",
  port: 993, // imap port
  tls: true,
  connTimeout: 10000, // Default by node-imap
  authTimeout: 10000, // Default by node-imap,
  debug: console.log, // Or your custom function with only one incoming argument. Default: null
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  attachments: false, // download attachments as they are encountered to the project directory
  // attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
});

mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("mailbox", function(mailbox){
  //  console.log("Total number of mails: ", mailbox.messages.total); // this field in mailbox gives the total number of emails
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});

mailListener.on("headers", function(headers, seqno){
  //  console.log(headers)
  
});

mailListener.on("body", function(body, seqno){
//   console.log(body)
})

mailListener.on("attachment", function(attachment, path, seqno){
  // do something with attachment
   //console.log(attachment.content.toString("base64"))
});

mailListener.on("mail",async function(mail, seqno) {
  
  var fromdata= mail.headers.get("from")
      var todata=mail.headers.get("to")
      var ccdata=mail.headers.get("cc")

      var cc=false

      if(ccdata!=undefined){cc=true}

      var date=mail.date

    //   console.log(mail.attachments[0].content.toString("base64"))

    if(mail.attachments.length>0)
    {
      for(var i=0;i<mail.attachments.length;i++)
      {

         
         var file=mail.attachments[i].content.toString("base64") || ''
         var name=mail.attachments[i].filename || ''
         var type= mail.attachments[i].contentType || ''
         var size= mail.attachments[i].size || ''

         var datx={"from":fromdata.value,file:{file:file,name:name,type:type,size:size}  , "to":todata.value,"cc":cc?ccdata.value:[],"date":mail.date,trxn:Date.now().toString()}
          console.log(datx)
         await axios.post("https://ap-south-1.aws.data.mongodb-api.com/app/contrato-invc-cofeu/endpoint/hook/save/email/attachment",datx)
         mailListener.stop();
         
      }
    }

    if(mail.attachments.length==0){
      var datx={"from":fromdata.value,"file":{file:''} , "to":todata.value,"cc":cc?ccdata.value:[],"date":mail.date,trxn:Date.now().toString()}
          console.log(datx)
         await axios.post("https://ap-south-1.aws.data.mongodb-api.com/app/contrato-invc-cofeu/endpoint/hook/save/email/attachment",datx)
         mailListener.stop();

    }
     

})



// it's possible to access imap object from node-imap library for performing additional actions. E.x.
// mailListener.imap.move(:msguids, :mailboxes, function(){})

//   rfsayxgoxzoijmvw

// https://github.com/satya-pverma/emailextract.git