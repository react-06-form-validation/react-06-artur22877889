'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createBookingSchema } from '../../schemas/bookingSchema';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import styles from './BookingForm.module.css';

export default function BookingForm() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTimeSlots = async () => {
      try {
        const res = await fetch('/api/time-slots');
        const data = await res.json();

        if (isMounted) {
          setTimeSlots(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setTimeSlots([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTimeSlots();

    return () => {
      isMounted = false;
    };
  }, []);

  // Build schema + resolver dynamically when timeSlots change
  const resolver = useMemo(() => {
    return zodResolver(createBookingSchema(timeSlots));
  }, [timeSlots]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver });

  const onSubmit = (data) => {
    console.log('Form data:', data);
    alert('Booking successful!');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputGroup}>
        <label htmlFor="bookerName" className={styles.label}>
          Booker Name
        </label>
        <input id="bookerName" className={styles.input} {...register('bookerName')} />
        <ErrorMessage message={errors.bookerName?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="bookerEmail" className={styles.label}>
          Booker Email
        </label>
        <input
          id="bookerEmail"
          className={styles.input}
          type="email"
          {...register('bookerEmail')}
        />
        <ErrorMessage message={errors.bookerEmail?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventName" className={styles.label}>
          Event Name
        </label>
        <input id="eventName" className={styles.input} {...register('eventName')} />
        <ErrorMessage message={errors.eventName?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventDate" className={styles.label}>
          Event Date
        </label>
        <input id="eventDate" className={styles.input} type="date" {...register('eventDate')} />
        <ErrorMessage message={errors.eventDate?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="numberOfGuests" className={styles.label}>
          Number of Guests
        </label>
        <input
          id="numberOfGuests"
          className={styles.input}
          type="number"
          {...register('numberOfGuests', { valueAsNumber: true })}
        />
        <ErrorMessage message={errors.numberOfGuests?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="timeSlot" className={styles.label}>
          Time Slot
        </label>

        <select id="timeSlot" className={styles.input} {...register('timeSlot')}>
          <option value="">Select a time slot</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        {isLoading && <p>Loading time slots...</p>}
        {!isLoading && timeSlots.length === 0 && <p>No time slots available.</p>}

        <ErrorMessage message={errors.timeSlot?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventLink" className={styles.label}>
          Event Link (Online)
        </label>
        <input id="eventLink" className={styles.input} type="url" {...register('eventLink')} />
        <ErrorMessage message={errors.eventLink?.message?.toString()} />
      </div>

      <button className={styles.button} type="submit">
        Book Event
      </button>
    </form>
  );
}