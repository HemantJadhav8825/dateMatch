import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    me: {}
  },
  reducers: {
    setUser: (state, action) => {
      state.me = action.payload
    },
    clearUser: state => {
      state.me = {}
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
