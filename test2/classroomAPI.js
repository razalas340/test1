//this is an outdated version of getting authorization: 

// const { google } = require("googleapis");
// const serviceAccount = require("./my-pre-course-project-1-5ce6e7fd624c.json")
// const clientEmail =  serviceAccount.client_email;;
// const privateKey = serviceAccount.private_key;
// const scopes = [
//     "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
//     "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
//     "https://www.googleapis.com/auth/classroom.coursework.students",
//     "https://www.googleapis.com/auth/classroom.coursework.me"
// ];
// const courseId = "NjE0ODI4Mzc3MDg0"; // Replace with your Course ID

// const jwt = new google.auth.JWT(clientEmail, null, privateKey, scopes);
// console.log(jwt);

// google.options({ auth: jwt });

// const classroom = google.classroom({ version: "v1" });

// jwt.authorize((err, response) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   classroom.courses.courseWork.list(
//     {
//       courseId: courseId,
//     },
//     (err, res) => {
//       if (err) {
//         console.error(err);
//         return;
//       }

//       console.log(res.data);
//     }
//   );
// });

//revised and updated version to get authorization part 1:

const { OAuth2Client } = require("google-auth-library");
const http = require('http');
const url = require('url');
const open = require('open');
const destroyer = require('server-destroy');
const keys = require("./my-pre-course-project-1-5ce6e7fd624c.json");
async function main() {
  const oAuth2Client = await getAuthenticatedClient();
  // Make a simple request to the People API using our pre-authenticated client. The `request()` method
  // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
  const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
  const res = await oAuth2Client.request({url});
  console.log(res.data);
// After acquiring an access_token, you may want to check on the audience, expiration,
  // or original scopes requested.  You can do that with the `getTokenInfo` method.
  const tokenInfo = await oAuth2Client.getTokenInfo(
    oAuth2Client.credentials.access_token
  );
  console.log(tokenInfo);
}
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
    // which should be downloaded from the Google Developers Console.
    const oAuth2Client = new OAuth2Client(
      keys.web.client_id,
      keys.web.client_secret,
      keys.web.redirect_uris[0]
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
    });

    // Open an http server to accept the oauth callback. In this simple example, the
    // only request to our webserver is to /oauth2callback?code=<code>
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            // acquire the code from the querystring, and close the web server.
            const qs = new url.URL(req.url, 'http://localhost:3000')
              .searchParams;
            const code = qs.get('code');
            console.log(`Code is ${code}`);
            res.end('Authentication successful! Please return to the console.');
            server.destroy();

            // Now that we have the code, use that to acquire tokens.
            const r = await oAuth2Client.getToken(code);
            // Make sure to set the credentials on the OAuth2 client.
            oAuth2Client.setCredentials(r.tokens);
            console.info('Tokens acquired.');
            resolve(oAuth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        open(authorizeUrl, {wait: false}).then(cp => cp.unref());
      });
    destroyer(server);
  });
}

main().catch(console.error);

//OLD CODE

// const serviceAccount = require("./my-pre-course-project-1-5ce6e7fd624c.json");
// const scopes = [
//   "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
//   "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
//   "https://www.googleapis.com/auth/classroom.coursework.students",
//   "https://www.googleapis.com/auth/classroom.coursework.me"
// ];
// const courseId = "NjE0ODI4Mzc3MDg0"; // Replace with your Course ID

// async function authorize() {
//   const auth = new GoogleAuth({
//     keyFile: "./my-pre-course-project-1-5ce6e7fd624c.json",
//     scopes,
//   });
//   const client = await auth.getClient();

//   const classroom = google.classroom({ version: "v1", auth: client });

//   const res = await classroom.courses.courseWork.list({
//     courseId: courseId,
//   });

//   console.log(res.data);
// }

// authorize().catch((err) => {
//   console.error(err);
// });

// //revised and updated do to issues with URI mismatch:
// const { GoogleAuth } = require("google-auth-library");
// const { google } = require("googleapis");
// const serviceAccount = require("./my-pre-course-project-1-5ce6e7fd624c.json");
// const scopes = [
//   "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
//   "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
//   "https://www.googleapis.com/auth/classroom.coursework.students",
//   "https://www.googleapis.com/auth/classroom.coursework.me"
// ];
// const courseId = "NjE0ODI4Mzc3MDg0"; // Replace with your Course ID

// async function authorize() {
//   const auth = new GoogleAuth({
//     keyFile: "./my-pre-course-project-1-5ce6e7fd624c.json",
//     scopes,
//   });
//   const client = await auth.getClient();

//   const classroom = google.classroom({ version: "v1", auth });

//   const res = await classroom.courses.courseWork.list({
//     courseId: courseId,
//   });

//   console.log(res.data);
// }

// authorize().catch((err) => {
//   console.error(err);
// });