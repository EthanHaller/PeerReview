import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { ReviewGrid } from "../../components/ReviewGrid";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";

interface SprintReview {
  reviewerId: string;
  reviewedTeammateId: string;
  keptUpWithResponsibilities: string;
  helpedTeamMembers: string;
  communicatedEffectively: string;
  ideasTakenSeriously: string;
  putInAppropriateTime: string;
  compatibility: string;
  overallEvaluationScore: string;
  improvementFeedback?: string;
  strengthFeedback?: string;
  isFlagged: boolean;
  sprintId: string;
}

export default function ReviewView() {
  const { reviewId } = useParams<{ reviewId: string }>();

  const { data: review, error, isLoading } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: async () => {
      const response = await api.get(`/reviews/getReviewById/${reviewId}`);
      return response.data.review;
    },
    enabled: !!reviewId,
  });

  return (
    <div className="container mx-auto p-6">
      <BackButton useNavigateBack />
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>
            {review?.reviewerId} reviewing {review?.reviewedTeammateId} - Sprint{" " + review?.sprintId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <p className="text-red-500">Failed to load review.</p>
          ) : review ? (
            <ReviewGrid reviews={[review]} />
          ) : (
            <p>No review found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
