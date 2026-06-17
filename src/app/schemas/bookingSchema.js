import { z } from "zod";

/**
 * Builds the Zod schema for the booking form.
 *
 * @param {string[]} availableTimeSlots - time slots fetched from `/api/time-slots`
 */
export const createBookingSchema = (availableTimeSlots = []) =>
  z.object({
    bookerName: z
      .string()
      .min(2, "Booker name must be at least 2 characters"),

    bookerEmail: z
      .string()
      .email("Invalid email format")
      .optional()
      .or(z.literal("")),

    eventName: z
      .string()
      .min(2, "Event name must be at least 2 characters"),

    eventDate: z
      .coerce
      .date()
      .refine((date) => date > new Date(), {
        message: "Event date must be in the future",
      }),

    numberOfGuests: z
      .number({ invalid_type_error: "Number of guests is required" })
      .int("Must be an integer")
      .min(1, "Minimum 1 guest")
      .max(10, "Maximum 10 guests"),

    timeSlot: z
      .string()
      .refine((val) => availableTimeSlots.includes(val), {
        message: "Please select a valid time slot",
      }),

    eventLink: z
      .string()
      .url("Must be a valid URL"),
  });
