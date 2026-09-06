import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IAnimal extends Document {
  owner: mongoose.Types.ObjectId;

  animalId: string;
  animalName: string;
  animalType: string;
  
  age: number;
  pregnancyMonth?: number;

  weight: number;
  milkCapacity: number;

  health: string;
  feed: string;
  water: string;
  supplements: string;
  growth: string;

  createdAt: Date;
  updatedAt: Date;
}

const AnimalSchema = new Schema<IAnimal>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    animalId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    animalName: {
      type: String,
      required: true,
      trim: true,
    },

    animalType: {
      type: String,
      required: true,
      enum: ["Cow", "Buffalo", "Goat"],
    },
   
  
    age: {
      type: Number,
      default: 0,
    },

    pregnancyMonth: {
  type: Number,
  default: null,
},
    weight: {
      type: Number,
      default: 0,
    },

    milkCapacity: {
      type: Number,
      default: 0,
    },

    health: {
      type: String,
      default: "Healthy",
    },

    feed: {
      type: String,
      default: "",
    },

    water: {
      type: String,
      default: "",
    },

    supplements: {
      type: String,
      default: "",
    },

    growth: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
AnimalSchema.index({
  owner: 1,
  animalId: 1,
});
const Animal =
  models.Animal || model<IAnimal>("Animal", AnimalSchema);

export default Animal;