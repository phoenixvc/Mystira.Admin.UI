import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { scenariosApi } from "../api/scenarios";
import { showToast } from "../utils/toast";

function ImportScenarioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => scenariosApi.uploadScenario(file, overwriteExisting),
    onSuccess: data => {
      showToast.success(data.message || "Scenario uploaded successfully!");
      navigate("/admin/scenarios");
    },
    onError: error => {
      showToast.error(error instanceof Error ? error.message : "Failed to upload scenario file");
      setUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".yaml") && !selectedFile.name.endsWith(".yml")) {
        showToast.error("Please select a .yaml or .yml file");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast.error("Please select a file");
      return;
    }

    setUploading(true);
    try {
      await uploadMutation.mutateAsync(file);
    } catch {
      // Error handled in onError
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">📥 Import Scenario</h1>
        <Link to="/admin/scenarios" className="btn btn-sm btn-outline-secondary">
          <i className="bi bi-arrow-left"></i> Back to Scenarios
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="scenarioFile" className="form-label">
                Scenario YAML File
              </label>
              <input
                type="file"
                className="form-control"
                id="scenarioFile"
                accept=".yaml,.yml"
                onChange={handleFileChange}
                disabled={uploading}
                required
              />
              <div className="form-text">Select a YAML file containing scenario definition</div>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="overwriteExisting"
                checked={overwriteExisting}
                onChange={e => setOverwriteExisting(e.target.checked)}
                disabled={uploading}
              />
              <label className="form-check-label" htmlFor="overwriteExisting">
                Overwrite existing scenario if title matches
              </label>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={!file || uploading}>
                {uploading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-upload"></i> Upload Scenario
                  </>
                )}
              </button>
              <Link to="/admin/scenarios" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ImportScenarioPage;
