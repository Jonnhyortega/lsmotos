
import mongoose, { Schema, model, models } from 'mongoose';

const SiteConfigSchema = new Schema({
  whatsapp: {
    type: String,
    default: ''
  },
  instagram: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  facebook: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  mapsLink: {
    type: String,
    default: ''
  },
  showWhatsapp: { type: Boolean, default: true },
  showInstagram: { type: Boolean, default: true },
  showFacebook: { type: Boolean, default: true },
  showEmail: { type: Boolean, default: true },
  showAddress: { type: Boolean, default: true },
  showMapsLink: { type: Boolean, default: true },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// We only need one config document, so we can treat this as a singleton in logic
const SiteConfig = models.SiteConfig || model('SiteConfig', SiteConfigSchema);

export default SiteConfig;
