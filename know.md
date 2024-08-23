// 3. API để lấy đánh giá trung bình cho một chuyến đi
router.get('/trips/:tripId/average-rating', async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const result = await Review.aggregate([
      { $match: { tripId: mongoose.Types.ObjectId(tripId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ]);
    const averageRating = result.length > 0 ? result[0].averageRating : 0;
    res.json({ averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// APi để đánh gia
router.post('/reviews', async (req, res) => {
  try { 
    const { userId, tripId, rating, comment } = req.body;
    const newReview = new Review({ userId, tripId, rating, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});