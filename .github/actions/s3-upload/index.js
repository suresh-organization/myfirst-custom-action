const core = require('@actions/core');
const github = require('@actions/github');
const AWS = require('aws-sdk');
const fs = require('fs');

async function getTemporaryCredentials() {
  const sts = new AWS.STS();
  const roleArn = core.getInput('iam-role-arn');
  const roleSessionName = 'GitHubActionSession';
  const params = {
    RoleArn: roleArn,
    RoleSessionName: roleSessionName,
  };
  const { Credentials } = await sts.assumeRole(params).promise();
  return Credentials;
}

async function uploadToS3(bucketName, fileName, fileData) {
  const s3 = new AWS.S3({
    credentials: await getTemporaryCredentials(),
  });
  const s3Params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileData,
  };
  return s3.upload(s3Params).promise();
}

async function run() {
  try {
    const bucketName = core.getInput('bucket-name');
    const fileName = core.getInput('file-name');
    const fileData = fs.readFileSync(fileName);
    const uploadedObject = await uploadToS3(bucketName, fileName, fileData);
    core.setOutput('s3-object-url', uploadedObject.Location);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
