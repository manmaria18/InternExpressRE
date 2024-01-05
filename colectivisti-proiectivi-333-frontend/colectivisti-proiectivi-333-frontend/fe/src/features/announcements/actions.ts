import { createAsyncThunk } from '@reduxjs/toolkit'
import { Submission, UpdateSubmission } from '../../types/Announcements'
import {
  addAnnouncementCall,
  fetchAnnouncementsCall,
  deleteAnnouncementsCall,
  fetchFilterAnnouncementsCall,
  updateAnnouncementCall,
} from './services'

export const fetchAnnouncements = createAsyncThunk('fetchAnnouncements', async () => {
  const response = await fetchAnnouncementsCall()

  return response.data
})

export const fetchFilterAnnouncements = createAsyncThunk('fetchFilterAnnouncements', async (text: string) => {
  const response = await fetchFilterAnnouncementsCall(text)

  return response.data
})

export const deleteAnnouncement = createAsyncThunk('deleteAnnouncement', async (id: number) => {
  const response = await deleteAnnouncementsCall(id)

  return response.data
})

export const addAnnouncement = createAsyncThunk('addAnnouncement', async (ann: Submission) => {
  try {
    // eslint-disable-next-line no-console
    console.log('I was here STEP 3', ann)
    const response = await addAnnouncementCall(ann)
    // eslint-disable-next-line no-console
    console.log('I was here STEP 4', response)
    return response.data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('API Error:', error)
    throw error // Rethrow the error to let Redux Toolkit handle it
  }
})

export const updateAnnouncement = createAsyncThunk('updateAnnouncement', async (ann: UpdateSubmission) => {
  const response = await updateAnnouncementCall(ann)

  return response.data
})
