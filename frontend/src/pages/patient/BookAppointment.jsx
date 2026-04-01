import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import { useFetch } from '../../hooks/useFetch'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function getDayName(dateStr) {
  if (!dateStr) return null
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[new Date(dateStr).getDay()]
}

function formatTime(time) {
  if (!time) return ''
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const display = hour % 12 === 0 ? 12 : hour % 12
  return `${display}:${m} ${ampm}`
}

function getProfileName(profiles) {
  if (!profiles) return 'Unknown'
  if (Array.isArray(profiles)) return profiles[0]?.full_name ?? 'Unknown'
  return profiles.full_name ?? 'Unknown'
}

export default function PatientBookAppointment() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookedAppointment, setBookedAppointment] = useState(null)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState(null)

  const { data: doctors, loading, error, refetch } = useFetch(async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        id,
        specialization,
        license_no,
        profiles (full_name, email)
      `)
    if (error) throw error
    console.log('doctors raw:', JSON.stringify(data?.[0]))
    return (data || []).sort((a, b) => {
      const nameA = getProfileName(a.profiles)
      const nameB = getProfileName(b.profiles)
      return nameA.localeCompare(nameB)
    })
  })

  const { data: availability, loading: availabilityLoading } = useFetch(async () => {
    if (!selectedDoctor) return []
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('doctor_id', selectedDoctor)
    if (error) throw error
    return data || []
  }, [selectedDoctor])

  const { data: existingAppointments } = useFetch(async () => {
    if (!selectedDoctor) return []
    const { data, error } = await supabase
      .from('appointments')
      .select('scheduled_at')
      .eq('doctor_id', selectedDoctor)
      .eq('status', 'scheduled')
    if (error) throw error
    return data || []
  }, [selectedDoctor])

  const availableDays = availability
    ? [...new Set(availability.map(s => s.day))].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b))
    : []

  const slotsForDay = availability
    ? availability.filter(s => s.day === selectedDay)
    : []

  function isSlotBooked(slot) {
    if (!existingAppointments) return false
    return existingAppointments.some(appt => {
      const apptTime = new Date(appt.scheduled_at)
      const apptHour = apptTime.getHours().toString().padStart(2, '0')
      const apptMin = apptTime.getMinutes().toString().padStart(2, '0')
      const apptTimeStr = `${apptHour}:${apptMin}`
      return apptTimeStr >= slot.start_time && apptTimeStr < slot.end_time
    })
  }

  async function handleBookAppointment() {
    if (!user?.id || !selectedDoctor || !selectedDay || !selectedSlot) {
      setBookingError('Please select a doctor, day and time slot')
      return
    }

    setIsBooking(true)
    setBookingError(null)

    try {
      const today = new Date()
      const todayDay = getDayName(today.toISOString().split('T')[0])
      const daysUntil = (DAY_ORDER.indexOf(selectedDay) - DAY_ORDER.indexOf(todayDay) + 7) % 7
      const appointmentDate = new Date(today)
      appointmentDate.setDate(today.getDate() + (daysUntil === 0 ? 7 : daysUntil))

      const [startH, startM] = selectedSlot.start_time.split(':')
      appointmentDate.setHours(parseInt(startH), parseInt(startM), 0, 0)

      const doubleBooked = (existingAppointments || []).some(appt =>
        new Date(appt.scheduled_at).getTime() === appointmentDate.getTime()
      )

      if (doubleBooked) {
        setBookingError('This slot is already booked. Please choose another.')
        return
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: user.id,
          doctor_id: selectedDoctor,
          scheduled_at: appointmentDate.toISOString(),
          status: 'scheduled'
        }])
        .select()

      if (error) throw error

      setBookedAppointment(data?.[0])
      setSelectedDoctor(null)
      setSelectedDay('')
      setSelectedSlot(null)
    } catch (err) {
      setBookingError(err.message || 'Failed to book appointment')
    } finally {
      setIsBooking(false)
    }
  }

  if (authLoading) {
    return (
      <PageLayout>
        <h1>Book Appointment</h1>
        <LoadingSpinner />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Book an Appointment</h1>
          <p style={{ color: 'gray' }}>Select a doctor and available time slot</p>
        </div>

        {bookedAppointment && (
          <div style={{
            padding: '1.25rem', borderRadius: 12,
            background: '#dcfce7', border: '1px solid #86efac', marginBottom: '2rem'
          }}>
            <p style={{ color: '#15803d', fontWeight: 500, marginBottom: '0.5rem' }}>
              ✓ Appointment booked successfully!
            </p>
            <p style={{ color: '#15803d', fontSize: 14, marginBottom: '1rem' }}>
              Your appointment has been scheduled.
            </p>
            <button
              onClick={() => navigate('/patient/appointments')}
              style={{
                padding: '0.5rem 1rem', borderRadius: 8, border: 'none',
                background: '#15803d', color: 'white', cursor: 'pointer', fontSize: 14
              }}
            >
              View Your Appointments
            </button>
          </div>
        )}

        {/* Step 1: Select Doctor */}
        <div style={{
          padding: '1.5rem', borderRadius: 12,
          border: '1px solid #e5e7eb', marginBottom: '1.5rem', background: 'white'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: 16, fontWeight: 600 }}>Step 1: Select a Doctor</h2>

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}

          {!loading && !error && doctors && (
            <div style={{ display: 'grid', gap: '0.75rem', maxHeight: 400, overflowY: 'auto' }}>
              {doctors.map(doctor => (
                <div
                  key={doctor.id}
                  onClick={() => {
                    setSelectedDoctor(doctor.id)
                    setSelectedDay('')
                    setSelectedSlot(null)
                  }}
                  style={{
                    padding: '1rem', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                    border: selectedDoctor === doctor.id ? '2px solid #0369a1' : '1px solid #e5e7eb',
                    background: selectedDoctor === doctor.id ? '#f0f9ff' : 'white'
                  }}
                >
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                    Dr. {getProfileName(doctor.profiles)}
                  </p>
                  <p style={{ fontSize: 14, color: 'gray', marginBottom: '0.25rem' }}>
                    {doctor.specialization}
                  </p>
                  <p style={{ fontSize: 12, color: '#666' }}>License: {doctor.license_no}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Select Day and Slot */}
        {selectedDoctor && (
          <div style={{
            padding: '1.5rem', borderRadius: 12,
            border: '1px solid #e5e7eb', marginBottom: '1.5rem', background: 'white'
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: 16, fontWeight: 600 }}>Step 2: Select Day & Time</h2>

            {availabilityLoading ? (
              <LoadingSpinner />
            ) : availableDays.length === 0 ? (
              <p style={{ color: 'gray' }}>This doctor has no availability set yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: 14 }}>
                    Select Day
                  </label>
                  <select
                    value={selectedDay}
                    onChange={e => { setSelectedDay(e.target.value); setSelectedSlot(null) }}
                    style={{
                      width: '100%', padding: '0.6rem 0.75rem', borderRadius: 8,
                      border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit',
                      background: 'white'
                    }}
                  >
                    <option value="">Choose a day...</option>
                    {availableDays.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                {selectedDay && (
                  <div>
                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: 14 }}>
                      Select Time Slot
                    </label>
                    <select
                      value={selectedSlot ? JSON.stringify(selectedSlot) : ''}
                      onChange={e => setSelectedSlot(e.target.value ? JSON.parse(e.target.value) : null)}
                      style={{
                        width: '100%', padding: '0.6rem 0.75rem', borderRadius: 8,
                        border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit',
                        background: 'white'
                      }}
                    >
                      <option value="">Choose a time slot...</option>
                      {slotsForDay.map(slot => {
                        const booked = isSlotBooked(slot)
                        return (
                          <option key={slot.id} value={JSON.stringify(slot)} disabled={booked}>
                            {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                            {booked ? ' (unavailable)' : ''}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {bookingError && (
          <div style={{
            padding: '1rem', borderRadius: 8, background: '#fee2e2',
            border: '1px solid #fca5a5', color: '#b91c1c', marginBottom: '1rem'
          }}>
            {bookingError}
          </div>
        )}

        {selectedDoctor && selectedDay && selectedSlot && !bookedAppointment && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleBookAppointment}
              disabled={isBooking}
              style={{
                flex: 1, padding: '0.75rem', borderRadius: 8, border: 'none',
                background: '#0369a1', color: 'white', cursor: isBooking ? 'not-allowed' : 'pointer',
                fontWeight: 600, opacity: isBooking ? 0.6 : 1
              }}
            >
              {isBooking ? 'Booking...' : 'Confirm Appointment'}
            </button>
            <button
              onClick={() => {
                setSelectedDoctor(null)
                setSelectedDay('')
                setSelectedSlot(null)
                setBookingError(null)
              }}
              style={{
                flex: 1, padding: '0.75rem', borderRadius: 8,
                border: '1px solid #e5e7eb', background: 'white',
                cursor: 'pointer', fontWeight: 600
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
