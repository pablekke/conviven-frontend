import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export type QueueStatus = "pending" | "processing" | "done";

export interface QueueItem {
  id: string;
  title: string;
  status: QueueStatus;
  createdAt: string;
}

interface QueueState {
  items: QueueItem[];
}

const initialState: QueueState = {
  items: [],
};

const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    enqueue: {
      reducer(state, action: PayloadAction<QueueItem>) {
        state.items.push(action.payload);
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            status: "pending" as QueueStatus,
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    advance(state, action: PayloadAction<string>) {
      const item = state.items.find(
        (candidate) => candidate.id === action.payload
      );
      if (!item) return;
      if (item.status === "pending") {
        item.status = "processing";
      } else if (item.status === "processing") {
        item.status = "done";
      }
    },
    remove(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clear(state) {
      state.items = [];
    },
  },
});

export const { enqueue, advance, remove, clear } = queueSlice.actions;

export const queueReducer = queueSlice.reducer;
