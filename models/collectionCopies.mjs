import { Schema, model } from 'mongoose';

const collectionCopyPrefixSchema = Schema({
  prefix: String,
	timestamp: {
		type: Number, default: new Date().getTime()
	}
})

const CollectionCopyPrefixModel = model('collectionCopyPrefix', collectionCopyPrefixSchema) ;
export default CollectionCopyPrefixModel ;