import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name
      state.token = action.payload.token
    },
    clearUser: (state) => {
      state.name = ''
      state.token = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
