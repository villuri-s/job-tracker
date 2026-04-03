import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import API_BASE_URL from "./apiConfig";
import { getStoredToken, isTokenExpired } from "./auth";
import AddJobForm from "./components/AddJobForm";
import DashboardHeader from "./components/DashboardHeader";
import JobCard from "./components/JobCard";
import JobCharts from "./components/JobCharts";
import JobFilters from "./components/JobFilters";
import LogoutDialog from "./components/LogoutDialog";
import {
  SOFT_SHADOW,
  STATUS_OPTIONS,
  buildJobDrafts,
  formatApiError,
  getJobDateValue,
  readResponseBody,
} from "./jobTrackerConfig";

const emptyDraft = {
  company: "",
  role: "",
  status: "Applied",
  notes: "",
};

function JobTracker({ username, onLogout, onSessionExpired }) {
  const [jobs, setJobs] = useState([]);
  const [jobDrafts, setJobDrafts] = useState({});
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [savingNewJob, setSavingNewJob] = useState(false);
  const [savingJobId, setSavingJobId] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const requestWithAuth = useCallback(
    async (path, options = {}, fallbackMessage = "Request failed") => {
      const token = getStoredToken();

      if (!token || isTokenExpired(token)) {
        onSessionExpired();
        throw new Error("Session expired. Please login again.");
      }

      let response;

      try {
        response = await fetch(`${API_BASE_URL}${path}`, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        throw new Error(
          "Backend is unreachable. Please check if your API server is running."
        );
      }

      const responseBody = await readResponseBody(response);

      if (response.status === 401) {
        onSessionExpired();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error(formatApiError(responseBody, fallbackMessage));
      }

      return responseBody;
    },
    [onSessionExpired]
  );

  const fetchJobs = useCallback(async () => {
    try {
      setLoadingJobs(true);
      const data = await requestWithAuth("/jobs", {}, "Failed to load jobs");
      const jobList = Array.isArray(data) ? data : [];

      setJobs(jobList);
      setJobDrafts(buildJobDrafts(jobList));
      setError("");
    } catch (err) {
      setJobs([]);
      setJobDrafts({});
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  }, [requestWithAuth]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const expiryCheck = window.setInterval(() => {
      if (isTokenExpired(getStoredToken())) {
        onSessionExpired();
      }
    }, 30000);

    return () => window.clearInterval(expiryCheck);
  }, [onSessionExpired]);

  const dashboardStats = useMemo(
    () => ({
      total: jobs.length,
      applied: jobs.filter((job) => job.status === "Applied").length,
      interviews: jobs.filter((job) => job.status === "Interview").length,
      offers: jobs.filter((job) => job.status === "Offer").length,
    }),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return [...jobs]
      .filter((job) => filter === "All" || job.status === filter)
      .filter((job) =>
        (job.company || "").toLowerCase().includes(normalizedQuery)
      )
      .sort((leftJob, rightJob) => {
        if (sortBy === "status") {
          return (
            STATUS_OPTIONS.indexOf(leftJob.status) -
            STATUS_OPTIONS.indexOf(rightJob.status)
          );
        }

        const leftDate = getJobDateValue(leftJob);
        const rightDate = getJobDateValue(rightJob);
        return sortBy === "oldest" ? leftDate - rightDate : rightDate - leftDate;
      });
  }, [jobs, filter, searchQuery, sortBy]);

  const statusChartData = useMemo(
    () =>
      STATUS_OPTIONS.map((statusName) => ({
        name: statusName,
        value: jobs.filter((job) => job.status === statusName).length,
      })).filter((entry) => entry.value > 0),
    [jobs]
  );

  const companyChartData = useMemo(() => {
    const companyMap = jobs.reduce((summary, job) => {
      const companyName = job.company?.trim() || "Unknown";
      summary[companyName] = (summary[companyName] || 0) + 1;
      return summary;
    }, {});

    return Object.entries(companyMap)
      .map(([name, value]) => ({ name, value }))
      .sort((left, right) => right.value - left.value)
      .slice(0, 8);
  }, [jobs]);

  const handleDraftChange = (jobId, field, value) => {
    setJobDrafts((currentDrafts) => ({
      ...currentDrafts,
      [jobId]: {
        ...(currentDrafts[jobId] || emptyDraft),
        [field]: value,
      },
    }));
  };

  const addJob = async () => {
    if (!company.trim() || !role.trim()) {
      setError("Company and Role are required.");
      setSuccessMessage("");
      return;
    }

    try {
      setSavingNewJob(true);
      setSuccessMessage("");

      await requestWithAuth(
        "/jobs",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: company.trim(),
            role: role.trim(),
            status,
            notes: notes.trim(),
          }),
        },
        "Failed to save job"
      );

      setCompany("");
      setRole("");
      setStatus("Applied");
      setNotes("");
      setSuccessMessage("Job application added successfully.");
      setError("");
      await fetchJobs();
    } catch (err) {
      setError(err.message || "Failed to save job");
    } finally {
      setSavingNewJob(false);
    }
  };

  const saveJob = async (jobId) => {
    const draft = jobDrafts[jobId] || emptyDraft;

    if (!draft.company.trim() || !draft.role.trim()) {
      setError("Company and Role cannot be empty.");
      setSuccessMessage("");
      return;
    }

    try {
      setSavingJobId(jobId);
      setSuccessMessage("");

      await requestWithAuth(
        `/jobs/${jobId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: draft.company.trim(),
            role: draft.role.trim(),
            status: draft.status,
            notes: draft.notes.trim(),
          }),
        },
        "Failed to update job"
      );

      setSuccessMessage("Job updated successfully.");
      setError("");
      await fetchJobs();
    } catch (err) {
      setError(err.message || "Failed to update job");
    } finally {
      setSavingJobId(null);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      setSuccessMessage("");

      await requestWithAuth(
        `/jobs/${jobId}`,
        { method: "DELETE" },
        "Failed to delete job"
      );

      setSuccessMessage("Job deleted successfully.");
      setError("");
      await fetchJobs();
    } catch (err) {
      setError(err.message || "Failed to delete job");
    }
  };

  const confirmLogout = () => {
    setLogoutDialogOpen(false);
    onLogout();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 5,
        background:
          "radial-gradient(circle at top left, #DBEAFE 0, #F8FAFC 35%, #EFF6FF 55%, #FFFFFF 100%)",
      }}
    >
      <Container maxWidth="xl">
        <DashboardHeader
          username={username}
          onLogoutClick={() => setLogoutDialogOpen(true)}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        <AddJobForm
          company={company}
          role={role}
          status={status}
          notes={notes}
          savingNewJob={savingNewJob}
          onCompanyChange={setCompany}
          onRoleChange={setRole}
          onStatusChange={setStatus}
          onNotesChange={setNotes}
          onAddJob={addJob}
        />

        <JobCharts
          dashboardStats={dashboardStats}
          statusChartData={statusChartData}
          companyChartData={companyChartData}
        />

        <JobFilters
          searchQuery={searchQuery}
          sortBy={sortBy}
          filter={filter}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onFilterChange={setFilter}
        />

        <Grid container spacing={3}>
          {loadingJobs ? (
            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 4,
                  boxShadow: SOFT_SHADOW,
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                }}
              >
                <CircularProgress size={40} thickness={4} />
                <Typography mt={2} fontWeight={700} color="#0F172A">
                  Loading your jobs...
                </Typography>
              </Paper>
            </Grid>
          ) : filteredJobs.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  textAlign: "center",
                  borderRadius: 4,
                  boxShadow: SOFT_SHADOW,
                  border: "1px dashed rgba(148, 163, 184, 0.4)",
                }}
              >
                <Typography variant="h6" fontWeight={800} color="#0F172A">
                  {jobs.length === 0 ? "No jobs yet" : "No matching jobs found"}
                </Typography>
                <Typography color="text.secondary" mt={1}>
                  {jobs.length === 0
                    ? "Add your first application from the form above to start tracking your pipeline."
                    : "Try changing your search keyword, status filter, or sorting preference."}
                </Typography>
              </Paper>
            </Grid>
          ) : (
            filteredJobs.map((job) => (
              <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <JobCard
                  job={job}
                  draft={jobDrafts[job.id] || emptyDraft}
                  isSaving={savingJobId === job.id}
                  onDraftChange={handleDraftChange}
                  onSaveJob={saveJob}
                  onDeleteJob={deleteJob}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      <LogoutDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={confirmLogout}
      />

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={2500}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage("")}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default JobTracker;
