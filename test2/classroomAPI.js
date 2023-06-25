const { google } = require("googleapis");
const serviceAccount = require("./my-pre-course-project-1-5ce6e7fd624c.json")
const clientEmail =  serviceAccount.client_email;;
const privateKey = serviceAccount.private_key;
const scopes = [
    "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.coursework.me"
];
const courseId = "NjE0ODI4Mzc3MDg0"; // Replace with your Course ID

const jwt = new google.auth.JWT(clientEmail, null, privateKey, scopes);
console.log(jwt);

google.options({ auth: jwt });

const classroom = google.classroom({ version: "v1" });

jwt.authorize((err, response) => {
  if (err) {
    console.error(err);
    return;
  }

  classroom.courses.courseWork.list(
    {
      courseId: courseId,
    },
    (err, res) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(res.data);
    }
  );
});
