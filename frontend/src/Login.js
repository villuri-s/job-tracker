import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import API_BASE_URL from "./apiConfig";
import { saveSession } from "./auth";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const endpoint = isRegister ? "/register" : "/token";
    let headers = {};
    let body;

    if (isRegister) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({ username, email, password });
    } else {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      body = formData;
    }

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body,
      });

      const data = await res.json();

      if (res.ok) {
        if (isRegister) {
          setSuccess("Registered successfully! Please login.");
          setIsRegister(false);
        } else {
          saveSession(data.access_token, username);
          onLogin(username);
        }
      } else {
        setError(data.detail || "Error occurred");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        background:
          "radial-gradient(circle at top left, #DBEAFE 0, #F8FAFC 40%, #EFF6FF 60%, #FFFFFF 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
            border: "1px solid rgba(148, 163, 184, 0.25)",
          }}
        >
          <Stack spacing={1} textAlign="center" mb={3}>
            <Typography variant="overline" color="primary" fontWeight={800}>
              Job Tracker Pro
            </Typography>
            <Typography variant="h4" fontWeight={900} color="#0F172A">
              {isRegister ? "Create your account" : "Welcome back"}
            </Typography>
            <Typography color="text.secondary">
              {isRegister
                ? "Sign up to start tracking your job pipeline."
                : "Login to manage your applications and analytics dashboard."}
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {isRegister && (
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.4,
                borderRadius: 3,
                fontWeight: 800,
                boxShadow: "0 14px 30px rgba(37, 99, 235, 0.25)",
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : isRegister ? (
                "Register"
              ) : (
                "Login"
              )}
            </Button>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1, fontWeight: 700, borderRadius: 3 }}
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setSuccess("");
              }}
            >
              {isRegister
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
