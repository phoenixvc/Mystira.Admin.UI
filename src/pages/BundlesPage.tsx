import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { bundlesApi } from "../api/bundles";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { showToast } from "../utils/toast";

function BundlesPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bundles", page, pageSize, searchTerm],
    queryFn: () =>
      bundlesApi.getBundles({
        page,
        pageSize,
        searchTerm: searchTerm || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bundlesApi.deleteBundle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      showToast.success("Bundle deleted successfully");
    },
    onError: () => {
      showToast.error("Failed to delete bundle");
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this bundle?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        // Error handled by onError callback
      }
    }
  };

  const handleSearchReset = () => {
    setSearchTerm("");
    setPage(1);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading bundles..." />;
  }

  if (error) {
    return (
      <ErrorAlert
        error={error}
        title="Error loading bundles"
        onRetry={() => queryClient.invalidateQueries({ queryKey: ["bundles"] })}
      />
    );
  }

  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">📦 Bundles</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <Link to="/admin/bundles/import" className="btn btn-sm btn-primary">
              <i className="bi bi-plus-circle"></i> Import Bundle
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
        placeholder="Search bundles..."
        onSearchReset={handleSearchReset}
      />

      <div className="card">
        <div className="card-body">
          {data && data.bundles.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Version</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bundles.map(bundle => (
                      <tr key={bundle.id}>
                        <td>{bundle.name}</td>
                        <td>{bundle.description || "-"}</td>
                        <td>{bundle.version || "-"}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Link
                              to={`/admin/bundles/import`}
                              className="btn btn-outline-primary"
                              title="Bundles are file-based. Use import to update."
                            >
                              <i className="bi bi-upload"></i> Re-import
                            </Link>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(bundle.id)}
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
              <p className="text-muted">No bundles found.</p>
              <Link to="/admin/bundles/import" className="btn btn-primary">
                Import Your First Bundle
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BundlesPage;
