import { PrismaClient } from "@prisma/client";

// Prisma Client initialization
const prisma = new PrismaClient();

// Create new feedback
const createFeedback = async (req, res) => {
  try {
    const { userId, comment, rating } = req.body;

    // Validate feedback input
    if (!userId || !comment || rating === undefined) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Parse rating as a float
    const parsedRating = parseFloat(rating);

    // Check if the parsed rating is a valid number
    if (isNaN(parsedRating)) {
      return res.json({
        success: false,
        message: "Rating must be a valid number",
      });
    }

    // Save feedback to the database
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        comment,
        rating: parsedRating, // Use parsed float rating
        date: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error submitting feedback" });
  }
};

// Get feedback for admin or user
const getFeedback = async (req, res) => {
  try {
    const { userId } = req.query;

    let feedback;
    if (userId) {
      // Fetch feedback for a specific user
      feedback = await prisma.feedback.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { date: "desc" },
      });
    } else {
      // Fetch all feedback for admin view
      feedback = await prisma.feedback.findMany({
        orderBy: { date: "desc" },
        include: { user: true }, // Include user info if required in the admin panel
      });
    }

    res.json({ success: true, feedback });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching feedback" });
  }
};

export { createFeedback, getFeedback };
