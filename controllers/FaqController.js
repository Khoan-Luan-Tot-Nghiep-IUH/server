const FAQ = require('../models/FAQ');

// Lấy tất cả các câu hỏi ở cấp đầu tiên (root level)
exports.getRootQuestions = async (req, res) => {
  try {
    const questions = await FAQ.find({ parentQuestionId: null }).select('question answers');
    res.status(200).json({
      success: true,
      data: questions,
      message: "Danh sách câu hỏi cấp đầu tiên đã được lấy thành công"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy câu hỏi theo ID và các câu trả lời tiếp theo nếu có
exports.getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    // Tìm câu hỏi theo ID và populate các câu hỏi tiếp theo trong answers
    const question = await FAQ.findById(id).populate('answers.nextQuestionId', 'question answers');
    if (!question) {
      return res.status(404).json({ success: false, message: "Câu hỏi không tồn tại." });
    }

    res.status(200).json({
      success: true,
      data: question,
      message: "Chi tiết câu hỏi đã được lấy thành công"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo câu hỏi mới
exports.createQuestion = async (req, res) => {
  const { question, answers, parentQuestionId } = req.body;
  try {
    const newFAQ = new FAQ({ question, answers, parentQuestionId });
    await newFAQ.save();

    res.status(201).json({
      success: true,
      data: newFAQ,
      message: "Câu hỏi mới đã được tạo thành công"
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question, answers } = req.body;
  try {
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      { question, answers, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedFAQ) {
      return res.status(404).json({ success: false, message: "Câu hỏi không tồn tại." });
    }

    res.status(200).json({
      success: true,
      data: updatedFAQ,
      message: "Câu hỏi đã được cập nhật thành công"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa câu hỏi và các câu hỏi con liên quan
exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    await FAQ.deleteOne({ _id: id });
    await FAQ.deleteMany({ parentQuestionId: id });

    res.status(200).json({
      success: true,
      message: "Câu hỏi và các câu hỏi con đã được xóa thành công"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
