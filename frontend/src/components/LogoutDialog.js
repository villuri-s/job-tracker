import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function LogoutDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
        },
      }}
    >
      <DialogTitle fontWeight={800}>Confirm logout</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to logout from Job Search Command Center?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 3, fontWeight: 700 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LogoutDialog;
