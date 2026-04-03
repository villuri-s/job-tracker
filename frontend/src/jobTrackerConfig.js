export const STATUS_OPTIONS = ["Applied", "Interview", "Offer", "Rejected"];
export const FILTER_OPTIONS = ["All", ...STATUS_OPTIONS];

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Status", value: "status" },
];

export const STATUS_THEME = {
  Applied: {
    color: "#2563EB",
    background: "#DBEAFE",
    shadow: "rgba(37, 99, 235, 0.18)",
  },
  Interview: {
    color: "#F97316",
    background: "#FFEDD5",
    shadow: "rgba(249, 115, 22, 0.2)",
  },
  Offer: {
    color: "#16A34A",
    background: "#DCFCE7",
    shadow: "rgba(22, 163, 74, 0.2)",
  },
  Rejected: {
    color: "#DC2626",
    background: "#FEE2E2",
    shadow: "rgba(220, 38, 38, 0.18)",
  },
};

export const CARD_SHADOW = "0 24px 60px rgba(15, 23, 42, 0.12)";
export const SOFT_SHADOW = "0 18px 35px rgba(15, 23, 42, 0.08)";

export const buildJobDrafts = (jobs) =>
  jobs.reduce((drafts, job) => {
    drafts[job.id] = {
      company: job.company || "",
      role: job.role || "",
      status: job.status || "Applied",
      notes: job.notes || "",
    };
    return drafts;
  }, {});

export const getJobDateValue = (job) => {
  const apiDate =
    job.created_at ||
    job.createdAt ||
    job.updated_at ||
    job.updatedAt ||
    job.application_date ||
    job.applicationDate;

  const parsedDate = Date.parse(apiDate);

  if (!Number.isNaN(parsedDate)) {
    return parsedDate;
  }

  const numericId = Number(job.id);
  return Number.isNaN(numericId) ? 0 : numericId;
};

export const formatApiError = (errorBody, fallbackMessage) => {
  if (typeof errorBody?.detail === "string") {
    return errorBody.detail;
  }

  if (Array.isArray(errorBody?.detail) && errorBody.detail.length > 0) {
    return errorBody.detail
      .map((detailItem) => detailItem?.msg || JSON.stringify(detailItem))
      .join(", ");
  }

  if (typeof errorBody?.message === "string") {
    return errorBody.message;
  }

  return fallbackMessage;
};

export const readResponseBody = async (response) => {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return { message: responseText };
  }
};
