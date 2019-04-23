var express = require('express');
var app = express();
var cors = require('cors')
var multer = require('multer')
var bodyParser = require('body-parser')
var Busboy = require('busboy');
var nodemailer = require("nodemailer");
var base64_encode = require('../src/Utils/base64_encode').base64_encode
var auth = require('./auth.js').auth
console.log(base64_encode)
var fs = require('fs');


var upload = multer()
 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())



var smtpTransport = nodemailer.createTransport({
    service: "gmail",
     auth: {
         user: auth.user,
         pass: auth.pass
     }
});



// function to encode file data to base64 encoded string



app.post('/sendPDFs', upload.any() , function (req, res) {
    console.log('/sendPDFs API')
    console.log('req.files:', req.files)
    console.log('email:', req.body.email)
    var files = req.files

    //Save the PDF files.


    var filenames = []
    // var savePDFs = new Promise((resolve, reject) => {
        for(let i = 0; i < files.length; i ++ ){
            let file = files[i]
            let filename = file.fieldname + '.pdf'
            let binary = file.buffer
            filenames.push(filename)
    
    
            var fs = require('fs')
            fs.writeFileSync(filename, binary , 'binary')

        }
        //         // Then send the PDF files to the email address
        //         var busboy = new Busboy({ headers: req.headers });
        //         var attachments = [];
    
        //         var mailOptions = { 
        //             from: "vovv760@gmail.com", // sender address
        //             to: req.body.email, // comma separated list of receivers
        //             subject: "[*My Chart*] Your charts' PDF files.", // Subject line
        //             text: "Hello!" // plaintext body
        //         };
            
        //         busboy 
        //         .on('file', function(fieldname, file, filename, encoding, mimetype){
        //             attachments.push({
        //                filename: filename,
        //                content: file.toString('base64'),
        //                encoding: 'base64'
        //             });
        //         })
        //         .on('finish', function() {
        //             mailOptions.attachments = attachments;
        //             smtpTransport.sendMail(mailOptions, function (err, info) {
        //                if (err) {
        //                    //handle error
        //                }
        //                 // email sent
        //            });
        //         });
                
        // // }

    // }).then((resolve) => {
        
        var attachments = []

        // img2base64
        for(let i= 0; i < filenames.length; i ++) {
            let thisPath = __dirname + '\\' +  filenames[i]
            console.log('thispath:', thisPath)

            let thisUri = base64_encode(thisPath)
            attachments.push({
                filename: filenames[i],
                content: thisUri,
                encoding: 'base64'
            })
        }

        var mailOptions = { 
            from:'vovv760@gmail.com', // sender address
            to:  req.body.email, // comma separated list of receivers
            subject: "[My Chart] Your charts' PDF files.", // Subject line
            html: "<h5>Thank you for using our app!</h5>" // plaintext body
        };
        mailOptions.attachments = attachments;
        smtpTransport.sendMail(mailOptions, function (err, info) {
           if (err) {
               res.send({error: 'ERROR: Failed to send the email'})
           }
           console.log('Email sent? info:', info)
            res.send({message: 'Suceeded to send the email.'})
        });



        
    // }).catch(reject => {
    //     res.send(reject)
    // })

    

  })

var server = app.listen(8080, function(){
  // var host = server.address().address
  var port = server.address().port 
  console.log(`Example app is listening http://localhost:${port}`)
})