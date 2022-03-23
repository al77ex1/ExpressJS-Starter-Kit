### Require
Add AWS keys to env file:

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_BUCKET_NAME

### How it works

1. Login and get an access token;
2. In the body url '/aws-file' (post) substitute the file name and type file. 
In response, you will receive the s3name of which you need to use when uploading a file to AWS by the method PUT;
3. Use s3name for check or delete file;
