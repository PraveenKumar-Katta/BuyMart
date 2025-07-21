const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /.+\@.+\..+/ 
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'vendor'],
    default: 'user'
  },
  phone: {type:String,default:9876543210},
  address: {
  type: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String }
},
  storeName: String,       // for vendor
  storeLogo: String,       // for vendor
  isVerified: Boolean,     // for vendor/admin checks
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
