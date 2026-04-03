import React from "react";
import { Button, Grid, MenuItem, Paper, Stack, TextField } from "@mui/material";
import { FILTER_OPTIONS, SOFT_SHADOW, SORT_OPTIONS } from "../jobTrackerConfig";

function JobFilters({
  searchQuery,
  sortBy,
  filter,
  onSearchChange,
  onSortChange,
  onFilterChange,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        mb: 3,
        boxShadow: SOFT_SHADOW,
        border: "1px solid rgba(148, 163, 184, 0.2)",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            fullWidth
            label="Search by company"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            select
            fullWidth
            label="Sort"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {FILTER_OPTIONS.map((filterName) => (
              <Button
                key={filterName}
                variant={filter === filterName ? "contained" : "outlined"}
                onClick={() => onFilterChange(filterName)}
                sx={{
                  borderRadius: 999,
                  px: 2.5,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                {filterName}
              </Button>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default JobFilters;
