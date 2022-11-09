const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide ratin"],
    },
    performance: {
      type: String,
      enum: ["awesome", "fair", "bad"],
      default: "awesome",
    },
    comment: {
      type: String,
      required: [true, "Please provide comment"],
      maxlength: 150,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ doctor: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (doctorId) {
  const result = await this.aggeregate([
    {
      $match: { doctor: doctorId },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Doctor").findOneAndUpdate(
      { _id: doctorId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.doctor);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.doctor);
});

module.exports = mongoose.model("Review", ReviewSchema);
