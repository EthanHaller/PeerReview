import express, { Request, Response } from "express"
import { db } from "../../netlify/functions/firebase"
import { authenticateUser } from "../../netlify/functions/middleware/auth"
import { OpenAI } from "openai"

const router = express.Router()

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

const summarizeStudentFeedback = async (req: Request, res: Response): Promise<void> => {
	const { computingID } = req.params

	if (!computingID) {
		res.status(400).json({ message: "Missing computingID parameter" })
		return
	}

	try {
		const reviewsSnapshot = await db.collection("reviews").where("reviewedTeammateId", "==", computingID).get()

		if (reviewsSnapshot.empty) {
			res.status(404).json({ message: "No reviews found for this student" })
			return
		}

		const feedbackEntries = reviewsSnapshot.docs
			.map((doc) => doc.data())
			.filter((review) => review.strengthFeedback || review.improvementFeedback)
			.map((review) => ({
				strengths: review.strengthFeedback || "",
				improvements: review.improvementFeedback || "",
			}))

		if (feedbackEntries.length === 0) {
			res.status(200).json({ message: "No feedback available for summarization" })
			return
		}

		const feedbackText = feedbackEntries
			.map((entry, index) => `Review ${index + 1}:\nStrengths: ${entry.strengths}\nImprovements: ${entry.improvements}\n`)
			.join("\n")

		const prompt = `
            Summarize the following feedback for a student. Provide key strengths and areas for improvement in a concise and constructive manner. Do not include any emojis or markdown language as this will be used in a string in a p tag in html.

            ${feedbackText}

            Output the summary in the format:
            Strengths: [Concise summary]
            
            Areas for Improvement: [Concise summary]
            `

		const openaiResponse = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{ role: "system", content: "You are a helpful AI summarizing student feedback." },
				{ role: "user", content: prompt },
			],
			max_tokens: 200,
		})

		const summary = openaiResponse.choices[0]?.message?.content!.trim()

		res.status(200).json({ computingID, summary })
	} catch (error) {
		console.error("Error summarizing student feedback:", error)
		res.status(500).json({ message: "Failed to summarize student feedback" })
	}
}

router.get("/summarizeFeedback/:computingID", authenticateUser, summarizeStudentFeedback)

export default router
