import { getGCPCredentials } from '@/utils/configHelper';
import { Storage } from '@google-cloud/storage';


const credentials = getGCPCredentials();
if (!credentials) {
  throw new Error('GCP credentials are missing or invalid.');
}
const storage = new Storage(credentials);
const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

export { bucket };