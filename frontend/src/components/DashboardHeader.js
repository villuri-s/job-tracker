import React from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { CARD_SHADOW } from "../jobTrackerConfig";

function DashboardHeader({ username, onLogoutClick }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
        borderRadius: 5,
        boxShadow: CARD_SHADOW,
        border: "1px solid rgba(148, 163, 184, 0.25)",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={3}
      >
        <Box>
          <Typography variant="overline" color="primary" fontWeight={800}>
            Portfolio Job Tracker
          </Typography>
          <Typography variant="h3" fontWeight={900} color="#0F172A">
            Job Search Command Center
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Track applications, edit pipeline details, and visualize offer
            momentum in one polished dashboard.
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Box textAlign="right">
            <Typography variant="body2" color="text.secondary">
              Signed in as
            </Typography>
            <Typography variant="h6" fontWeight={800} color="#0F172A">
              {username}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              color: "#1D4ED8",
              bgcolor: "#DBEAFE",
            }}
          >
            {username?.charAt(0)?.toUpperCase() || "U"}
          </Box>
          <Button
            variant="outlined"
            color="error"
            onClick={onLogoutClick}
            sx={{ borderRadius: 3, px: 3, py: 1.2, fontWeight: 700 }}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default DashboardHeader;
