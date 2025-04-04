import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import api from "../api"
import ReviewTrendChart from "./ReviewTrendChart"
import Spinner from "./Spinner"

interface ReviewScores {
	[sprintId: string]: {
		[category: string]: number
	}
}

export default function StudentPerformance() {
	const { computingID } = useParams<{ computingID: string }>()

	const { data, isLoading, error } = useQuery({
		queryKey: ["reviewTrends", computingID],
		queryFn: async () => {
			const res = await api.get(`/reviews/averages/${computingID}`)
			return res.data as ReviewScores
		},
		enabled: !!computingID,
		staleTime: 1000 * 60 * 60,
	})

	const {
		data: allSprints,
		isLoading: sprintsLoading,
		error: sprintsError,
	} = useQuery({
		queryKey: ["sprints"],
		queryFn: async () => {
			const res = await api.get("/sprints/getSprints")
			return res.data as { id: string }[]
		},
		staleTime: 1000 * 60 * 60,
	})

	if (isLoading || sprintsLoading) return <Spinner />
	if (error || sprintsError) return <p className="text-red-500">Error loading data.</p>
	if (!data || !allSprints) return <p className="text-gray-500">No data available.</p>

	const sprintIds = allSprints.map((s) => s.id).sort((a, b) => a.localeCompare(b))
	const categories = Object.keys(data[sprintIds[0]] || {})
	const trendsByCategory: Record<string, { sprint: string; score: number | null }[]> = {}

	categories.forEach((category) => {
		trendsByCategory[category] = sprintIds.map((sprintId) => ({
			sprint: sprintId,
			score: data[sprintId]?.[category] ?? null,
		}))
	})

	return (
		<div className="max-w-5xl mx-auto my-8">
			<h1 className="text-2xl font-semibold text-center">Review Trends for {computingID}</h1>
			<ReviewTrendChart trendsByCategory={trendsByCategory} />
		</div>
	)
}
