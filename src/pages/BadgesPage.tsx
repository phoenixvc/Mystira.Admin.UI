import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { badgesApi } from "../api/badges";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { showToast } from "../utils/toast";

function BadgesPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["badges", page, pageSize, searchTerm],
    queryFn: () =>
      badgesApi.getBadges({
        page,
        pageSize,
        searchTerm: searchTerm || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => badgesApi.deleteBadge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this badge?")) {
      try {
        await deleteMutation.mutateAsync(id);
        showToast.success("Badge deleted successfully");
      } catch (err) {
        showToast.error("Failed to delete badge");
      }
    }
  };

  const handleSearchReset = () => {
    setSearchTerm("");
    setPage(1);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading badges..." />;
  }

  if (error) {
    return (
      <ErrorAlert
        error={error}
        title="Error loading badges"
        onRetry={() => queryClient.invalidateQueries({ queryKey: ["badges"] })}
      />
    );
  }

  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">🏅 Badges</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <Link to="/admin/badges/import" className="btn btn-sm btn-primary">
              <i className="bi bi-plus-circle"></i> Import Badge
            </Link>
          </div>
        </div>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={value => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder="Search badges..."
        onSearchReset={handleSearchReset}
      />

      <div className="card">
        <div className="card-body">
          {data && data.badges.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Image ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.badges.map(badge => (
                      <tr key={badge.id}>
                        <td>{badge.name}</td>
                        <td>{badge.description || "-"}</td>
                        <td>{badge.imageId || "-"}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => {
                                // TODO: Implement edit
                                alert("Edit functionality coming soon");
                              }}
                            >
                              <i className="bi bi-pencil"></i> Edit
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(badge.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <i className="bi bi-trash"></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No badges found.</p>
              <Link to="/admin/badges/import" className="btn btn-primary">
                Import Your First Badge
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BadgesPage;
