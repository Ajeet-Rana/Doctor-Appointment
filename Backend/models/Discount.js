const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const discountTrackingSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    isDiscountUsed: {
      type: Boolean,
      required: true,
      default: false,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware to update the updatedAt field
discountTrackingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const DiscountTracking = mongoose.model(
  "DiscountTracking",
  discountTrackingSchema
);

module.exports = DiscountTracking;
