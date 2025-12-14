import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { badgesApi } from "../api/badges";

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
      } catch (err) {
        alert("Failed to delete badge");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading badges: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

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

      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search badges..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

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

              {data.totalCount > pageSize && (
                <nav>
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    <li className="page-item active">
                      <span className="page-link">
                        Page {page} of {Math.ceil(data.totalCount / pageSize)}
                      </span>
                    </li>
                    <li
                      className={`page-item ${
                        page >= Math.ceil(data.totalCount / pageSize) ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= Math.ceil(data.totalCount / pageSize)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
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
