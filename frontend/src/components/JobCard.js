import React from "react";
import {
  Button,
  Card,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SOFT_SHADOW, STATUS_OPTIONS, STATUS_THEME } from "../jobTrackerConfig";

function JobCard({ job, draft, isSaving, onDraftChange, onSaveJob, onDeleteJob }) {
  const statusStyle = STATUS_THEME[draft.status] || STATUS_THEME.Applied;

  return (
    <Card
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 4,
        border: "1px solid rgba(148, 163, 184, 0.2)",
        boxShadow: SOFT_SHADOW,
        height: "100%",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Chip
            label={draft.status}
            size="small"
            sx={{
              bgcolor: statusStyle.background,
              color: statusStyle.color,
              fontWeight: 800,
              borderRadius: 2,
              height: 30,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            ID #{job.id}
          </Typography>
        </Stack>

        <TextField
          label="Company"
          fullWidth
          size="small"
          value={draft.company}
          onChange={(event) => onDraftChange(job.id, "company", event.target.value)}
          sx={{ "& .MuiInputBase-input": { py: 1.1, fontSize: 14 } }}
        />

        <TextField
          label="Role"
          fullWidth
          size="small"
          value={draft.role}
          onChange={(event) => onDraftChange(job.id, "role", event.target.value)}
          sx={{ "& .MuiInputBase-input": { py: 1.1, fontSize: 14 } }}
        />

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 700 }}
          >
            Status
          </Typography>
          <TextField
            select
            size="small"
            value={draft.status}
            onChange={(event) => onDraftChange(job.id, "status", event.target.value)}
            sx={{
              width: 150,
              "& .MuiSelect-select": { py: 0.95, fontSize: 14, fontWeight: 700 },
            }}
          >
            {STATUS_OPTIONS.map((statusName) => (
              <MenuItem key={statusName} value={statusName}>
                {statusName}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <TextField
          label="Notes"
          fullWidth
          multiline
          minRows={2}
          size="small"
          value={draft.notes}
          onChange={(event) => onDraftChange(job.id, "notes", event.target.value)}
          sx={{ "& .MuiInputBase-input": { fontSize: 14, lineHeight: 1.5 } }}
        />

        <Stack direction="row" spacing={1.5}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => onSaveJob(job.id)}
            disabled={isSaving}
            sx={{
              borderRadius: 3,
              py: 1,
              fontSize: 13,
              fontWeight: 800,
              boxShadow: "0 14px 30px rgba(37, 99, 235, 0.2)",
            }}
          >
            {isSaving ? "Saving" : "Save"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() => onDeleteJob(job.id)}
            sx={{ borderRadius: 3, py: 1, fontSize: 13, fontWeight: 800 }}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default JobCard;
