import React from "react";
import { Button, Grid, MenuItem, Paper, TextField } from "@mui/material";
import { SOFT_SHADOW, STATUS_OPTIONS } from "../jobTrackerConfig";

function AddJobForm({
  company,
  role,
  status,
  notes,
  savingNewJob,
  onCompanyChange,
  onRoleChange,
  onStatusChange,
  onNotesChange,
  onAddJob,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        mb: 4,
        boxShadow: SOFT_SHADOW,
        border: "1px solid rgba(148, 163, 184, 0.2)",
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            label="Company"
            fullWidth
            value={company}
            onChange={(event) => onCompanyChange(event.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            label="Role"
            fullWidth
            value={role}
            onChange={(event) => onRoleChange(event.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            select
            label="Status"
            fullWidth
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            {STATUS_OPTIONS.map((statusName) => (
              <MenuItem key={statusName} value={statusName}>
                {statusName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            label="Notes"
            fullWidth
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={onAddJob}
            disabled={savingNewJob}
            sx={{
              height: "100%",
              minHeight: 56,
              borderRadius: 3,
              fontWeight: 800,
              boxShadow: "0 14px 30px rgba(37, 99, 235, 0.25)",
            }}
          >
            {savingNewJob ? "Saving" : "Add"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AddJobForm;
