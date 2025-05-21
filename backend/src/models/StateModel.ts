import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema(
  {
    uniqueStateId: { type: String, required: true },
    name: { type: String, required: true },
    stateImage: { type: String, required: true },
  },
  { timestamps: true }
);

const State = mongoose.model('State', stateSchema);
export default State;
