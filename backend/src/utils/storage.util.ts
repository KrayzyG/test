import { Storage } from '@google-cloud/storage';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { generateSecureFilename } from './crypto.util';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Initialize Firebase
let firebaseApp: FirebaseApp;
let firebaseStorage: any;

const initializeFirebase = () => {
  if (!firebaseApp) {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    };

    firebaseApp = initializeApp(firebaseConfig);
    firebaseStorage = getStorage(firebaseApp);
  }
  
  return { firebaseApp, firebaseStorage };
};

/**
 * Upload a file to Firebase Storage
 * @param file File buffer or path
 * @param destination Destination path in storage
 * @param originalFilename Original filename
 * @returns Download URL
 */
export const uploadToFirebase = async (
  file: Buffer | string,
  destination: string,
  originalFilename: string
): Promise<string> => {
  try {
    const { firebaseStorage } = initializeFirebase();
    
    // Generate a secure filename
    const secureFilename = generateSecureFilename(originalFilename);
    const fullPath = `${destination}/${secureFilename}`;
    
    // Create a reference to the storage location
    const storageRef = ref(firebaseStorage, fullPath);
    
    // If file is a path, read it first
    let fileBuffer: Buffer;
    if (typeof file === 'string') {
      fileBuffer = fs.readFileSync(file);
    } else {
      fileBuffer = file;
    }
    
    // Upload the file
    await uploadBytes(storageRef, fileBuffer);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading to Firebase:', error);
    throw new Error('Failed to upload file to storage');
  }
};

/**
 * Delete a file from Firebase Storage
 * @param fileUrl File URL to delete
 * @returns True if deleted successfully
 */
export const deleteFromFirebase = async (fileUrl: string): Promise<boolean> => {
  try {
    const { firebaseStorage } = initializeFirebase();
    
    // Extract the path from the URL
    const urlObj = new URL(fileUrl);
    const pathName = urlObj.pathname;
    
    // The path in the URL is usually in the format /v0/b/[bucket]/o/[encoded-path]
    // We need to extract the encoded path and decode it
    const encodedPath = pathName.split('/o/')[1];
    const decodedPath = decodeURIComponent(encodedPath);
    
    // Create a reference to the file
    const fileRef = ref(firebaseStorage, decodedPath);
    
    // Delete the file
    await deleteObject(fileRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting from Firebase:', error);
    return false;
  }
};

/**
 * Save a file to the local filesystem
 * @param file File buffer
 * @param destination Destination directory
 * @param originalFilename Original filename
 * @returns File path
 */
export const saveToLocalFilesystem = async (
  file: Buffer,
  destination: string,
  originalFilename: string
): Promise<string> => {
  try {
    // Generate a secure filename
    const secureFilename = generateSecureFilename(originalFilename);
    
    // Create the destination directory if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    
    // Full path to save the file
    const filePath = path.join(destination, secureFilename);
    
    // Write the file
    fs.writeFileSync(filePath, file);
    
    return filePath;
  } catch (error) {
    console.error('Error saving to local filesystem:', error);
    throw new Error('Failed to save file to local filesystem');
  }
};

/**
 * Create a temporary file
 * @param content File content
 * @param extension File extension
 * @returns Temporary file path
 */
export const createTempFile = async (content: string | Buffer, extension: string = 'tmp'): Promise<string> => {
  try {
    // Create a temporary directory if it doesn't exist
    const tempDir = path.join(os.tmpdir(), 'locket-clone');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Generate a temporary filename
    const tempFilename = `${generateSecureFilename('temp')}.${extension}`;
    const tempFilePath = path.join(tempDir, tempFilename);
    
    // Write the content to the file
    if (typeof content === 'string') {
      fs.writeFileSync(tempFilePath, content, 'utf8');
    } else {
      fs.writeFileSync(tempFilePath, content);
    }
    
    return tempFilePath;
  } catch (error) {
    console.error('Error creating temporary file:', error);
    throw new Error('Failed to create temporary file');
  }
};

/**
 * Delete a file
 * @param filePath Path to the file
 * @returns True if deleted successfully
 */
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};
