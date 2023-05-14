import { createHash, randomBytes } from 'crypto';
import getFileDataModel from "../models/fileData.mjs"
import { MONGO_ERR_DUPLICATE_KEY } from "../utils/errcodes.mjs";

export default class FileDataLib {
	// Create a file-data entry
	static async createFileDataEntry(foreignId, category, dataBlob) {
		const FileData = getFileDataModel() ;

		const [header, dataBase64] = dataBlob.split(',') ;

		// Calculate SHA256
		const buff = Buffer.from(dataBase64, 'base64');
		const sha256 = Buffer.from(createHash('sha256').update(buff).digest('hex')).toString();

		// Get file type (for extension)
		const dataType = header.split(':')[1].split(';')[0] ;
		const fileType = dataType.split('/')[1] ;

		// Store entry
		// (filename should be unique so that we can easily find and change instances in the database if the file for this category is changed)
		// (we could check for duplicates but the probability of one occurring is negligible)
		const fileName = randomBytes(8).toString('hex') + "_" + sha256 + "." + fileType ;
		const fileData = new FileData({foreignId, fileName, category, dataBase64}) ;

		console.log("Creating file-data entry in DB:", fileName) ; 

		try {
			await fileData.save() ; // Note: We're restricted to 16MB (MongoDB document-size limit)
		}
		catch(err) {
			if (err.code !== MONGO_ERR_DUPLICATE_KEY) throw (err) ; // Unknown error
			// (silently fail for duplicates)
		}

		return fileName ;
	}

	// Remove a file-data entry
	static async removeFileDataEntry(foreignId, category) {
		const FileData = getFileDataModel() ;

		await FileData.deleteOne({ foreignId, category }) ; // (silently fail if it doesn't exist)
	}

	// Retrieve file data
	static async retrieveFileData(fileName) {
		const FileData = getFileDataModel() ;

		const fileData = await FileData.findOne({fileName}) ;
		if (!fileData) throw("Not found") ;
		return fileData.dataBase64 ;
	}
}