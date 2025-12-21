import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yaml from "js-yaml";
import { scenariosApi } from "../api/scenarios";
import { showToast } from "../utils/toast";
import {
  validateScenario,
  formatValidationErrors,
  groupErrorsByPath,
  ValidationError,
} from "../utils/schemaValidator";

function ImportScenarioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: ValidationError[];
  } | null>(null);
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
      if (
        !selectedFile.name.endsWith(".yaml") &&
        !selectedFile.name.endsWith(".yml") &&
        !selectedFile.name.endsWith(".json")
      ) {
        showToast.error("Please select a .yaml, .yml, or .json file");
        return;
      }
      setFile(selectedFile);
      setValidationResult(null);
    }
  };

  const handleValidate = async () => {
    if (!file) {
      showToast.error("Please select a file first");
      return;
    }

    setValidating(true);
    try {
      const fileContent = await file.text();
      let parsedData: unknown;

      // Parse based on file extension
      if (file.name.endsWith(".json")) {
        parsedData = JSON.parse(fileContent);
      } else {
        parsedData = yaml.load(fileContent);
      }

      // Validate against schema
      const result = validateScenario(parsedData);
      setValidationResult(result);

      if (result.valid) {
        showToast.success("Scenario validation passed!");
      } else {
        showToast.error(`Validation failed with ${result.errors.length} error(s)`);
      }
    } catch (error) {
      showToast.error(
        error instanceof Error ? `Parse error: ${error.message}` : "Failed to parse file"
      );
      setValidationResult({
        valid: false,
        errors: [
          {
            path: "root",
            message: error instanceof Error ? error.message : "Failed to parse file",
          },
        ],
      });
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast.error("Please select a file");
      return;
    }

    // If validation hasn't been run or failed, warn the user
    if (!validationResult) {
      const shouldContinue = window.confirm(
        "You haven't validated the scenario yet. Do you want to upload without validation?"
      );
      if (!shouldContinue) return;
    } else if (!validationResult.valid) {
      const shouldContinue = window.confirm(
        `Validation failed with ${validationResult.errors.length} error(s). Do you still want to upload?`
      );
      if (!shouldContinue) return;
    }

    setUploading(true);
    try {
      await uploadMutation.mutateAsync(file);
    } catch {
      // Error handled in onError
    }
  };

  const groupedErrors = validationResult?.errors
    ? groupErrorsByPath(validationResult.errors)
    : null;

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">📥 Import Scenario</h1>
        <Link to="/admin/scenarios" className="btn btn-sm btn-outline-secondary">
          <i className="bi bi-arrow-left"></i> Back to Scenarios
        </Link>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Schema Validation</h5>
          <p className="card-text">
            Before uploading, you can validate your scenario file against the Mystira story schema
            to catch any structural or formatting issues.
          </p>
          <p className="card-text text-muted mb-0">
            Validation checks for required fields, correct data types, valid enums, and schema
            constraints.
          </p>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="scenarioFile" className="form-label">
                Scenario File
              </label>
              <input
                type="file"
                className="form-control"
                id="scenarioFile"
                accept=".yaml,.yml,.json"
                onChange={handleFileChange}
                disabled={uploading || validating}
                required
              />
              <div className="form-text">
                Select a YAML (.yaml, .yml) or JSON (.json) file containing scenario definition
              </div>
            </div>

            {file && (
              <div className="mb-3">
                <div className="alert alert-info">
                  <strong>Selected file:</strong> {file.name} (
                  {(file.size / 1024).toFixed(2)} KB)
                </div>
              </div>
            )}

            <div className="mb-3">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleValidate}
                disabled={!file || validating || uploading}
              >
                {validating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Validating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle"></i> Validate Schema
                  </>
                )}
              </button>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="overwriteExisting"
                checked={overwriteExisting}
                onChange={e => setOverwriteExisting(e.target.checked)}
                disabled={uploading || validating}
              />
              <label className="form-check-label" htmlFor="overwriteExisting">
                Overwrite existing scenario if title matches
              </label>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!file || uploading || validating}
              >
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

      {validationResult && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Validation Results</h5>
            {validationResult.valid ? (
              <div className="alert alert-success">
                <i className="bi bi-check-circle-fill me-2"></i>
                <strong>Validation Passed!</strong> The scenario file is valid and ready to upload.
              </div>
            ) : (
              <>
                <div className="alert alert-danger">
                  <i className="bi bi-x-circle-fill me-2"></i>
                  <strong>Validation Failed!</strong> Found {validationResult.errors.length}{" "}
                  error(s) in the scenario file.
                </div>

                <div className="accordion" id="validationErrorsAccordion">
                  {groupedErrors &&
                    Array.from(groupedErrors.entries()).map(([path, errors], index) => (
                      <div className="accordion-item" key={path}>
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#error-collapse-${index}`}
                            aria-expanded={index === 0}
                          >
                            <strong>{path === "root" ? "Root Level" : path}</strong>
                            <span className="badge bg-danger ms-2">{errors.length}</span>
                          </button>
                        </h2>
                        <div
                          id={`error-collapse-${index}`}
                          className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                          data-bs-parent="#validationErrorsAccordion"
                        >
                          <div className="accordion-body">
                            <ul className="list-group">
                              {errors.map((error, idx) => (
                                <li key={idx} className="list-group-item list-group-item-danger">
                                  {error.message}
                                  {error.keyword && (
                                    <small className="text-muted d-block mt-1">
                                      Rule: {error.keyword}
                                    </small>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-3">
                  <details>
                    <summary className="btn btn-sm btn-outline-secondary">
                      View All Errors as Text
                    </summary>
                    <pre className="mt-2 p-3 bg-light border rounded">
                      <code>{formatValidationErrors(validationResult.errors)}</code>
                    </pre>
                  </details>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImportScenarioPage;
