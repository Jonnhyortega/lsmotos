import mongoose from 'mongoose';

const EmailLogSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
  },
  recipients: {
    type: Number,
    required: true,
  },
  recipientIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
  }],
  status: {
    type: String,
    default: 'Enviado', // Success, Failed
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.EmailLog || mongoose.model('EmailLog', EmailLogSchema);
