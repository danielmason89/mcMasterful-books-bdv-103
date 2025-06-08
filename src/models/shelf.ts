import mongoose from "mongoose";

const shelfSchema = new mongoose.Schema({
  bookId: {type: String, required: true},
  shelf: {type: Number, required: true},
  count: {type: String, required: true},
})

export default mongoose.model("Shelf", shelfSchema)