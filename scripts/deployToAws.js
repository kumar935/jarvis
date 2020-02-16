const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const {ID, SECRET} = require("../config/awsKeys");

// Enter copied or downloaded access ID and secret key here

// The name of the bucket that you have created
const BUCKET_NAME = "doubular";

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

// const params = {
//     Bucket: BUCKET_NAME,
//     CreateBucketConfiguration: {
//         // Set your region here
//         LocationConstraint: "eu-west-1"
//     }
// };

// s3.createBucket(params, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else console.log('Bucket Created Successfully', data.Location);
// });

const uploadFile = fileName => {
  // Read content from the file
  const fileContent = fs.readFileSync("./dist/testfile.js");
  // const data = fs.readFileSync(`${pathname}.res`.substring(1));
  // Setting up S3 upload parameters

  const params = {
    Bucket: BUCKET_NAME,
    Key: "testfile.js", // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

// uploadFile();






// configuration
const config = {
  s3BucketName: "doubular",
  folderPath: "../dist" // path relative script's location
};

// initialize S3 client
// const s3 = new AWS.S3({ signatureVersion: "v4" });

// resolve full folder path
const distFolderPath = path.join(__dirname, config.folderPath);

// get of list of files from 'dist' directory
fs.readdir(distFolderPath, (err, files) => {
  if (!files || files.length === 0) {
    console.log(
      `provided folder '${distFolderPath}' is empty or does not exist.`
    );
    console.log("Make sure your project was compiled!");
    return;
  }

  // for each file in the directory
  for (const fileName of files) {
    // get the full path of the file
    const filePath = path.join(distFolderPath, fileName);

    // ignore if directory
    if (fs.lstatSync(filePath).isDirectory()) {
      continue;
    }

    console.log(filePath);

    // read file contents
    fs.readFile(filePath, (error, fileContent) => {
      // if unable to read file contents, throw exception
      if (error) {
        throw error;
      }

      const params = {
        Bucket: BUCKET_NAME,
        Key: fileName, // File name you want to save as in S3
        Body: fileContent
      };
    
      // Uploading files to the bucket
      s3.upload(params, function(err, data) {
        if (err) {
          throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
      });

      // upload file to S3
    //   s3.putObject(
    //     {
    //       Bucket: config.s3BucketName,
    //       Key: fileName,
    //       Body: fileContent
    //     },
    //     res => {
    //       console.log(`Successfully uploaded '${fileName}'!`);
    //     }
    //   );
    });
  }
});
