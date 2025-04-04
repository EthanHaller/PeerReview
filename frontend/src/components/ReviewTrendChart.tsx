import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js"
import { Line } from "react-chartjs-2"
import { Card, CardContent } from "../components/ui/card"

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

interface ReviewTrendChartProps {
	trendsByCategory: {
		[category: string]: { sprint: string; score: number | null }[]
	}
}

const CATEGORY_LABELS: Record<string, string> = {
	overallEvaluationScore: "Overall Evaluation",
	keptUpWithResponsibilities: "Kept Up With Responsibilities",
	communicatedEffectively: "Communicated Effectively",
	putInAppropriateTime: "Put In Appropriate Time",
	helpedTeamMembers: "Helped Team Members",
	ideasTakenSeriously: "Ideas Taken Seriously",
	compatibility: "Compatibility",
}

const CATEGORY_COLORS: Record<string, string> = {
	overallEvaluationScore: "hsla(120, 85%, 55%, 0.5)",
	keptUpWithResponsibilities: "hsla(210, 85%, 60%, 0.5)",
	communicatedEffectively: "hsla(180, 85%, 55%, 0.5)",
	putInAppropriateTime: "hsla(45, 100%, 60%, 0.5)",
	helpedTeamMembers: "hsla(0, 85%, 60%, 0.5)",
	ideasTakenSeriously: "hsla(300, 85%, 65%, 0.5)",
	compatibility: "hsla(25, 90%, 60%, 0.5)",
}

export default function ReviewTrendChart({ trendsByCategory }: ReviewTrendChartProps) {
	const sprints = trendsByCategory[Object.keys(trendsByCategory)[0]]?.map((d) => `Sprint ${d.sprint}`) ?? []

	const datasets = Object.entries(trendsByCategory).map(([category, values]) => ({
		label: CATEGORY_LABELS[category] || category,
		data: values.map((v) => v.score),
		borderColor: CATEGORY_COLORS[category] || "hsl(0, 0%, 60%)",
		backgroundColor: CATEGORY_COLORS[category] || "hsl(0, 0%, 60%)",
		fill: false,
		tension: 0.3,
		pointRadius: 4,
		pointHoverRadius: 6,
		hidden: category !== "overallEvaluationScore",
	}))

	const data = {
		labels: sprints,
		datasets,
	}

	const options = {
		responsive: true,
		interaction: {
			mode: "index" as const,
			intersect: false,
		},
		plugins: {
			legend: {
				display: true,
				position: "top" as const,
				labels: {
					padding: 16,
					boxWidth: 16,
					boxHeight: 12,
					usePointStyle: true,
				},
			},
		},
		scales: {
			y: {
				min: 0,
				max: 5,
				ticks: {
					stepSize: 1,
				},
			},
		},
	}

	return (
		<Card className="mt-4">
			<CardContent>
				<h3 className="text-xl font-semibold mb-4 text-center">Peer Review Scores by Sprint</h3>
				<div className="chart-wrapper [&_.chartjs-legend_li]:cursor-pointer">
					<Line data={data} options={options} />
				</div>
			</CardContent>
		</Card>
	)
}
