Because of the codes for sending an email, to see how the app is running fully,
an addtional file is needed to include the information of the email account which you can use.


Requirements:

1) The email account should be a "Gmail" account.
2) The account's "less secoure app access" setting should be set to 'ON'.(https://myaccount.google.com/lesssecureapps).
3) The file name should be 'auth.js'.
4) The root directory of the file should be 'my-chart/Server'.
5) The codes in the 'auth.js' should be..<br/>
      var auth = {<br/>
        user: '(your gmail address)',<br/>
        pass: '(your gmail account's password)'<br/>
      }<br/>
<br/>
      module.exports = {<br/>
        auth: auth<br/>
      }

