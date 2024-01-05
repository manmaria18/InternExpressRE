import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, FormProvider, useController, useForm } from 'react-hook-form'
import { Role } from '../../../types/User'
import { FormInput } from '../../common/FormInput'
import { AnnouncementDto } from '../../../types/Announcements'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectInterestAreasOptions, selectInterestAreasOptionsLoading, selectUserData } from '../../account/selectors'
import { fetchInterestAreasOptions } from '../../account/actions'
import { LoadingOverlay } from '../../common/LoadingOverlay'
import { addAnnouncement, updateAnnouncement } from '../actions'
import { Select, MenuItem } from '@material-ui/core'

export type CreateAnnouncementType = {
  id: number
  title: string
  duration: string
  interestArea: string
  description: string
  internshipType: string
  domain: string
  linkToCompanyPage: URL
  startDate: Date
}

interface CreateAnnouncementModalProps {
  isOpened: boolean
  handleClose: () => void
  announcement?: AnnouncementDto
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  isOpened,
  handleClose,
  announcement,
}) => {
  const userData = useAppSelector(selectUserData)
  const role = userData?.role
  const dispatch = useAppDispatch()
  const [listOfInterestAreas, setListOfInterestAreas] = useState<string[]>([])
  const [areasId, setInterestAreasId] = useState<number | null>(null)

  const formMethods = useForm<CreateAnnouncementType>()
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = formMethods
  const interestAreasOptions = useAppSelector(selectInterestAreasOptions)
  const interestAreasOptionsLoading = useAppSelector(selectInterestAreasOptionsLoading)
  const predefinedInterestAreas = [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'Art' },
    { id: 4, name: 'Computer Science' },
    { id: 5, name: 'Law' },
    { id: 6, name: 'Psychology' },
  ]
  //HERE--------------------------
  //const { field: interestAreasField } = useController({ name: 'interestAreas', control })
  const { field: title } = useController({ name: 'title', control })
  const { field: duration } = useController({ name: 'duration', control })
  const { field: internshipType } = useController({ name: 'internshipType', control })
  const { field: domain } = useController({ name: 'domain', control })
  const { field: startDate } = useController({ name: 'startDate', control })
  const { field: linkToCompanyPage } = useController({ name: 'linkToCompanyPage', control })
  //const { field: interestArea } = useController({ name: 'interestArea', control })
  const { field: description } = useController({
    name: 'description',
    control,
    rules: { required: true },
  })

  const editMode = !!announcement

  useEffect(() => {
    // Fill with pre-existing data when updating
    if (announcement) {
      setValue('title', announcement.title)
      setValue('interestArea', announcement.interestAreas.name)
      setValue('description', announcement.description)
      setValue('duration', announcement.duration)
      setValue('domain', announcement.domain)
      setValue('internshipType', announcement.internshipType)
      setValue('linkToCompanyPage', announcement.linkToCompanyPage)
      setValue('startDate', announcement.startDate)
    }
  }, [announcement])

  const setInterestAreas = () => {
    const interestAreaNames: string[] = []
    interestAreasOptions?.map(interestArea => {
      interestAreaNames.push(interestArea.name)
    })
    interestAreaNames && setListOfInterestAreas(interestAreaNames)
  }

  const getInterestAreaId = (name: string) => {
    interestAreasOptions?.map(area => {
      area.name === name && setInterestAreasId(area.id)
    })
  }

  useEffect(() => {
    if (!interestAreasOptions) dispatch(fetchInterestAreasOptions())
    setInterestAreas()
  }, [dispatch, interestAreasOptions])

  const handleAssignmentSubmit: SubmitHandler<CreateAnnouncementType> = async formData => {
    getInterestAreaId(formData.interestArea)
    // eslint-disable-next-line no-console
    console.log('I WAS HERE: STEP 1')
    // eslint-disable-next-line no-console
    console.log('areasId' + areasId)
    // eslint-disable-next-line no-console
    console.log('userData' + userData)
    // eslint-disable-next-line no-console
    console.log('editMode' + editMode)
    if (userData && !editMode) {
      // eslint-disable-next-line no-console
      console.log('I WAS HERE: STEP 2')
      dispatch(
        addAnnouncement({
          interestAreasId: areasId,
          userId: userData?.id,
          title: formData.title,
          duration: formData.duration,
          domain: formData.domain,
          internshipType: formData.internshipType,
          linkToCompanyPage: formData.linkToCompanyPage,
          startDate: formData.startDate,
          description: formData.description,
        })
      )
    }

    if (areasId && userData && editMode) {
      dispatch(
        updateAnnouncement({
          id: announcement.id,
          interestAreasId: areasId,
          userId: userData?.id,
          title: formData.title,
          duration: formData.duration,
          domain: formData.domain,
          internshipType: formData.internshipType,
          linkToCompanyPage: formData.linkToCompanyPage,
          startDate: formData.startDate,
          description: formData.description,
        })
      )
    }
    handleClose()
  }

  const handleCloseModal = () => {
    reset({
      id: 0,
      title: '',
      description: '',
      interestArea: '',
      duration: '',
      domain: '',
      internshipType: '',
      //linkToCompanyPage: '',
      //startDate: Date.now(),
    })
    handleClose()
  }

  // Shouldn't be the case; just making sure
  if (role !== Role.MENTOR) return null

  return (
    <Dialog open={isOpened} onClose={handleCloseModal} disableScrollLock={true}>
      <LoadingOverlay visible={interestAreasOptionsLoading} />
      <StyledDialogTitle>{editMode ? 'Update' : 'Create'} Announcement</StyledDialogTitle>
      <FormProvider {...formMethods}>
        <FormWrapper onSubmit={handleSubmit(handleAssignmentSubmit)}>
          <StyledDialogContent>
            <DialogInstructions>
              Fill in the details for {editMode ? 'this' : 'the new'} announcement
            </DialogInstructions>
            <FormInput
              label="Title"
              fieldName="title"
              options={{
                required: true,
                minLength: {
                  value: 3,
                  message: 'Title should be min 3 characters long',
                },
              }}
              onChange={newTitle => {
                title.onChange(newTitle.target.value)
              }}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label="Duration"
              name="duration"
              size="small"
              color="secondary"
              type="text"
              error={!!errors.duration}
              helperText={errors.duration?.message}
              onChange={newDuration => {
                duration.onChange(newDuration.target.value)
              }}
            />
            <TextField
              label="Domain"
              name="domain"
              size="small"
              color="secondary"
              type="text"
              error={!!errors.domain}
              helperText={errors.domain?.message}
              onChange={newDomain => {
                domain.onChange(newDomain.target.value)
              }}
            />
            {/*<TextField*/}
            {/*  label="InternshipType"*/}
            {/*  name="internshipType"*/}
            {/*  size="small"*/}
            {/*  color="secondary"*/}
            {/*  type="text"*/}
            {/*  error={!!errors.internshipType}*/}
            {/*  helperText={errors.internshipType?.message}*/}
            {/*  onChange={newInternshipType => {*/}
            {/*    internshipType.onChange(newInternshipType.target.value)*/}
            {/*  }}*/}
            {/*/>*/}
            <Select
              labelId="internshipType-label"
              id="internshipType"
              name="internshipType"
              value={internshipType.value}
              onChange={internshipType.onChange}
            >
              {/* Add your dropdown options here */}
              <MenuItem value="option1">Fisical</MenuItem>
              <MenuItem value="option2">Remote</MenuItem>
              <MenuItem value="option2">Hybrid</MenuItem>
              {/* Add more options as needed */}
            </Select>
            <TextField
              label="StartDate"
              name="start date"
              size="small"
              color="secondary"
              type="date"
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
              onChange={newStartDate => {
                startDate.onChange(newStartDate.target.value)
              }}
            />
            <TextField
              label="LinkToCompanyPage"
              name="link to company page"
              size="small"
              color="secondary"
              type="url"
              error={!!errors.linkToCompanyPage}
              helperText={errors.linkToCompanyPage?.message}
              onChange={newLink => {
                linkToCompanyPage.onChange(newLink.target.value)
              }}
            />
            {/*<Autocomplete*/}
            {/*  options={listOfInterestAreas || []}*/}
            {/*  filterSelectedOptions*/}
            {/*  renderInput={params => (*/}
            {/*    <TextField*/}
            {/*      {...params}*/}
            {/*      helperText={errors.internshipType?.message}*/}
            {/*      error={!!errors.internshipType?.message}*/}
            {/*      color="secondary"*/}
            {/*      InputLabelProps={{ shrink: true }}*/}
            {/*      label="Internship type"*/}
            {/*    />*/}
            {/*  )}*/}
            {/*  onChange={(_, newInternshipType) => {*/}
            {/*    clearErrors('internshipType')*/}
            {/*    internshipType.onChange(newInternshipType, { shouldDirty: true })*/}
            {/*  }}*/}
            {/*/>*/}
            {/*<Autocomplete*/}
            {/*  options={predefinedInterestAreas || []}*/}
            {/*  filterSelectedOptions*/}
            {/*  renderInput={params => (*/}
            {/*    <TextField*/}
            {/*      {...params}*/}
            {/*      helperText={errors.interestArea?.message}*/}
            {/*      error={!!errors.interestArea?.message}*/}
            {/*      color="secondary"*/}
            {/*      InputLabelProps={{ shrink: true }}*/}
            {/*      label="Interest area"*/}
            {/*    />*/}
            {/*  )}*/}
            {/*  onChange={(_, newInterestArea) => {*/}
            {/*    clearErrors('interestArea')*/}
            {/*    interestArea.onChange(newInterestArea, { shouldDirty: true })*/}
            {/*  }}*/}
            {/*/>*/}
            {/*HERE STRICAT---------------------------------------*/}
            <Autocomplete
              multiple
              options={predefinedInterestAreas}
              getOptionLabel={option => option.name}
              getOptionSelected={(option, value) => option.id === value.id}
              value={interestAreasField ?? []}
              filterSelectedOptions
              renderInput={params => (
                <TextField
                  {...params}
                  helperText={errors.interestAreas?.message}
                  error={!!errors.interestAreas}
                  color="secondary"
                  InputLabelProps={{ shrink: true }}
                  label="Interest Areas"
                />
              )}
              onChange={(_, newInterestAreas) => {
                formMethods.clearErrors('interestAreas')
                if (newInterestAreas.length < 1) {
                  formMethods.setError('interestAreas', new Error('Must have at least 1 selected'))
                }

                interestAreasField.onChange(newInterestAreas)
                interestAreasField.onBlur()
              }}
            />

            <FormInput
              label="Description"
              fieldName="description"
              options={{ maxLength: 200, required: true }}
              error={!!errors.description}
              helperText="Max 200 characters"
              onChange={newDescription => {
                description.onChange(newDescription.target.value)
              }}
              multiline
              rows={3}
            />
          </StyledDialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="error">
              Cancel
            </Button>
            <Button color="info" type="submit" variant="outlined">
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </FormWrapper>
      </FormProvider>
    </Dialog>
  )
}

const FormWrapper = styled('form')`
  gap: 4px;
  width: 500px;
`

const StyledDialogTitle = styled(DialogTitle)`
  background: #ddd;
`

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const DialogInstructions = styled(DialogContentText)`
  margin-bottom: 15px;
`
