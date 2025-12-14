import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import { mediaApi } from "../api/media";

function MediaPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["media", page, pageSize, searchTerm],
    queryFn: () =>
      mediaApi.getMedia({
        page,
        pageSize,
        searchTerm: searchTerm || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mediaApi.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this media file?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert("Failed to delete media file");
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
        Error loading media:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">🖼️ Media</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <Link to="/admin/media/import" className="btn btn-sm btn-primary">
              <i className="bi bi-upload"></i> Upload Media
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
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {data && data.media.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Type</th>
                      <th>Size</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.media.map((media) => (
                      <tr key={media.id}>
                        <td>{media.fileName}</td>
                        <td>{media.contentType}</td>
                        <td>
                          {media.size
                            ? `${(media.size / 1024).toFixed(2)} KB`
                            : "-"}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <a
                              href={`/api/admin/mediaadmin/${media.id}`}
                              className="btn btn-outline-primary"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="bi bi-download"></i> Download
                            </a>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(media.id)}
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
                        page >= Math.ceil(data.totalCount / pageSize)
                          ? "disabled"
                          : ""
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
              <p className="text-muted">No media files found.</p>
              <Link to="/admin/media/import" className="btn btn-primary">
                Upload Your First Media File
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaPage;
