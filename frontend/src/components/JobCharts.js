import React from "react";
import { Box, Card, Grid, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SOFT_SHADOW, STATUS_THEME } from "../jobTrackerConfig";

function JobCharts({ dashboardStats, statusChartData, companyChartData }) {
  return (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Applications", value: dashboardStats.total, status: "Applied" },
          { label: "Interviews", value: dashboardStats.interviews, status: "Interview" },
          { label: "Offers", value: dashboardStats.offers, status: "Offer" },
        ].map((metric) => (
          <Grid key={metric.label} size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: `1px solid ${STATUS_THEME[metric.status].background}`,
                boxShadow: `0 24px 40px ${STATUS_THEME[metric.status].shadow}`,
                background: `linear-gradient(135deg, #FFFFFF 0%, ${STATUS_THEME[metric.status].background} 100%)`,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Typography variant="body2" fontWeight={700} color="text.secondary">
                {metric.label}
              </Typography>
              <Typography
                variant="h3"
                fontWeight={900}
                color={STATUS_THEME[metric.status].color}
              >
                {metric.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 4,
                boxShadow: SOFT_SHADOW,
                border: "1px solid rgba(148, 163, 184, 0.2)",
                height: { xs: 400, sm: 430 },
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                },
              }}
          >
            <Typography variant="h6" fontWeight={800} color="#0F172A" mb={1.5}>
              Status Distribution
            </Typography>
            {statusChartData.length === 0 ? (
              <Box height={320} display="grid" placeItems="center">
                <Typography color="text.secondary">No chart data yet</Typography>
              </Box>
            ) : (
              <Box sx={{ width: "100%", height: 320, overflow: "hidden" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="46%"
                    innerRadius={60}
                    outerRadius={92}
                    dataKey="value"
                    paddingAngle={2}
                    labelLine={false}
                  >
                    {statusChartData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_THEME[entry.name].color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: 12,
                      fontSize: 13,
                      lineHeight: "20px",
                    }}
                  />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 4,
                boxShadow: SOFT_SHADOW,
                border: "1px solid rgba(148, 163, 184, 0.2)",
                height: { xs: 400, sm: 430 },
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                },
              }}
          >
            <Typography variant="h6" fontWeight={800} color="#0F172A" mb={1.5}>
              Applications Per Company
            </Typography>
            {companyChartData.length === 0 ? (
              <Box height={320} display="grid" placeItems="center">
                <Typography color="text.secondary">
                  Add jobs to see company insights
                </Typography>
              </Box>
              ) : (
              <Box sx={{ width: "100%", height: 320, overflow: "hidden" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={companyChartData}
                    margin={{ top: 12, right: 12, bottom: 8, left: -12 }}
                  >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tick={{ fontSize: 12, fill: "#475569" }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    name="Applications"
                    fill="#2563EB"
                    radius={[14, 14, 0, 0]}
                    barSize={34}
                  />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default JobCharts;
