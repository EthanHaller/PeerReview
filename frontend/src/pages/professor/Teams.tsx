import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import Spinner from "../../components/Spinner";
import TeamCard from "../../components/TeamCard";
import api from "../../api";
import BackButton from "../../components/BackButton";

const fetchTeams = async ({
  searchTerm,
  page,
  limit,
  sprintID,
  severity,
}: {
  searchTerm: string;
  page: number;
  limit: number;
  sprintID: string;
  severity: string;
}) => {
  const response = await api.get(
    "/teams/searchteambysprint",
    {
      params: { search: searchTerm, page, limit, sprintID, severity },
    }
  )
  return response.data;
};

const Teams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit] = useState(20);

  const searchTerm = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const { sprintId } = useParams<{ sprintId: string }>();
  const sprintID = sprintId || "";
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const severity = searchParams.get("severity") || "";
  const severityData: string[] = ["bad", "medium", "good", "not filled out"];
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["teams", debouncedSearch, page, limit, sprintID, severity],
    queryFn: () =>
      fetchTeams({
        searchTerm: debouncedSearch,
        page,
        limit,
        sprintID,
        severity,
      }),
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleSearchChange = (value: string) => {
    setSearchParams({ search: value, page: "1", severity: severity });
  };
  const handleSeverityChange = (value: string) => {
    setSearchParams({
      search: searchTerm,
      page: "1",
      severity: value,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <BackButton useNavigateBack />
      <h1 className="text-3xl font-bold mb-4 text-primary">Teams Search</h1>

      <div className="mb-6 flex gap-4">
        <Input
          type="text"
          placeholder="Search by Team number"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full p-2"
        />
        <Select
          value={severity}
          onValueChange={(value) => handleSeverityChange(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            {severityData?.map((severity: string) => (
              <SelectItem key={severity} value={severity}>
                {severity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <div className="text-destructive-foreground">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to fetch Teams"}
        </div>
      )}

      <div className="overflow-x-auto">
        {isLoading ? (
          <Spinner />
        ) : (
          data?.teams.map((t: any) => (
            <Link key={t.team} to={`/sprint/${sprintId}/teams/${t.team}`}>
              <TeamCard team={t} students={t.students} />
            </Link>
          ))
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`?search=${debouncedSearch}&page=${page - 1}`}
                />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages })
              .map((_, idx) => idx + 1)
              .filter((pageNumber) => {
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(pageNumber - page) <= 1
                ) {
                  return true;
                }
                return false;
              })
              .reduce<(number | "ellipsis")[]>(
                (acc, pageNumber, idx, array) => {
                  if (idx > 0 && pageNumber !== array[idx - 1] + 1) {
                    acc.push("ellipsis");
                  }
                  acc.push(pageNumber);
                  return acc;
                },
                []
              )
              .map((item, idx) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href={`?search=${debouncedSearch}&page=${item}`}
                      isActive={item === page}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

            {page < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={`?search=${debouncedSearch}&page=${page + 1}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Teams;
