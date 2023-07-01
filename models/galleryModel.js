
import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    title: {
        type: String
    },
    property_id:{
        type: String
    },
    gallery_img:[{
        type: String,
        allowNull: false
    }],

},

{ timestamps: {createdAt: 'created_at',updatedAt: 'updated_at'} }

);

const Gallery = mongoose.model('gallery', gallerySchema)

export default Gallery;