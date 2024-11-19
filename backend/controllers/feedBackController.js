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

// Get all feedback with user information and date
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: { date: "desc" }, // Sort feedback by date in descending order
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Format the feedback data to include user's name, comment, rating, and date
    const formattedFeedback = feedback.map((fb) => ({
      username: `${fb.user.firstName} ${fb.user.lastName}`,
      rating: fb.rating,
      comment: fb.comment,
      date: fb.date.toLocaleString(), // Format the date to a readable string
    }));

    res.json({ success: true, feedback: formattedFeedback });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching feedback" });
  }
};

export { createFeedback, getAllFeedback };
