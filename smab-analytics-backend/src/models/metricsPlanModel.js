import mongoose from 'mongoose';

const metricsPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  day: {
    type: Number,
    required: true,
    min: 0
  },
  week: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Number,
    required: true,
    min: 0
  },
  year: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
metricsPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const MetricsPlans = mongoose.model('MetricsPlans', metricsPlanSchema);

export default MetricsPlans;
