import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { findCollisions, TEXT_KEY } from "../Utils/customData";

let nextPairId = 0;

const createPair = (key = "", value = "") => {
  nextPairId += 1;
  return { id: `pair-${nextPairId}`, key, value };
};

const seedFrom = (entry) => {
  const pairs = (entry?.pairs ?? []).map(({ key, value }) =>
    createPair(key, value)
  );

  return {
    text: entry?.text ?? "",
    pairs: pairs.length > 0 ? pairs : [createPair()],
  };
};


const toEntry = (draft) => ({
  text: draft.text,
  pairs: draft.pairs
    .filter((pair) => pair.key.trim())
    .map(({ key, value }) => ({ key, value })),
});

export default function CustomDataDialog({
  open,
  componentName = "",
  row,
  entry,
  onCancel,
  onSave,
}) {
  const [draft, setDraft] = useState(() => seedFrom(entry));


  useEffect(() => {
    if (open) {
      setDraft(seedFrom(entry));
    }
  }, [open, entry]);

  const collisions = useMemo(
    () => findCollisions(row, toEntry(draft)),
    [row, draft]
  );

  const updatePair = (id, field, value) => {
    setDraft((current) => ({
      ...current,
      pairs: current.pairs.map((pair) =>
        pair.id === id ? { ...pair, [field]: value } : pair
      ),
    }));
  };

  const addPair = () => {
    setDraft((current) => ({
      ...current,
      pairs: [...current.pairs, createPair()],
    }));
  };

  const removePair = (id) => {
    setDraft((current) => {
      const remaining = current.pairs.filter((pair) => pair.id !== id);

      return {
        ...current,
        pairs: remaining.length > 0 ? remaining : [createPair()],
      };
    });
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle component="div" sx={{ pb: 1 }}>
        <Typography variant="overline" color="text.secondary" display="block">
          Custom Data
        </Typography>

        <Typography variant="h6" noWrap title={componentName}>
          {componentName}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          label="Text"
          placeholder="A single custom value"
          helperText={`Published as ${TEXT_KEY}. Left blank, it is not sent.`}
          fullWidth
          size="small"
          value={draft.text}
          onChange={(event) =>
            setDraft((current) => ({ ...current, text: event.target.value }))
          }
        />

        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
          Key / value pairs
          <Typography component="span" variant="caption" color="text.secondary">
            {"  "}— blank keys are not sent
          </Typography>
        </Typography>

        <Stack spacing={1}>
          {draft.pairs.map((pair) => (
            <Stack key={pair.id} direction="row" spacing={1} alignItems="center">
              <TextField
                placeholder="key"
                size="small"
                sx={{ flex: 1 }}
                error={collisions.includes(pair.key.trim())}
                value={pair.key}
                onChange={(event) =>
                  updatePair(pair.id, "key", event.target.value)
                }
              />

              <TextField
                placeholder="value"
                size="small"
                sx={{ flex: 1.4 }}
                value={pair.value}
                onChange={(event) =>
                  updatePair(pair.id, "value", event.target.value)
                }
              />

              <IconButton
                aria-label="Remove pair"
                size="small"
                onClick={() => removePair(pair.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>

        <Button startIcon={<AddIcon />} size="small" onClick={addPair} sx={{ mt: 1.5 }}>
          Add pair
        </Button>

        {collisions.length > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Overwrites {collisions.length === 1 ? "a field" : "fields"} already
            on this component: <strong>{collisions.join(", ")}</strong>. The
            custom value wins in the pushed payload.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>

        <Button onClick={() => onSave(toEntry(draft))} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
