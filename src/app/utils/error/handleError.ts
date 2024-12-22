import { NextResponse } from 'next/server';
import toast from 'react-hot-toast';

const handleErrorToast = (error: unknown): void => {
  if (error instanceof Error && error.message) {
    toast.error(error.message);
  } else {
    toast.error('An unknown error occurred');
  }
};

const handleErrorLog = (error: unknown): void => {
  if (error instanceof Error && error.message) {
    console.error(error.message);
  } else {
    console.error('An unknown error occurred');
  }
};

const handleErrorToastAndLog = (error: unknown): void => {
  handleErrorLog(error);
  handleErrorToast(error);
};

const throwError = (error: unknown): never => {
  if (error instanceof Error && error.message) {
    throw new Error(error.message);
  } else {
    throw new Error('An unknown error occurred');
  }
};

/**
 * Handles API errors by returning a JSON response with an appropriate error message.
 *
 * @param error - The error object, which can be of any type. If it is an instance of `Error`, its message will be used.
 * @param success - A boolean indicating whether the operation was successful. Defaults to `false`.
 * @returns A JSON response containing the error message and the success status.
 */
const handleApiError = (error: unknown, success: boolean = false): NextResponse => {
  if (error instanceof Error && error.message) {
    return NextResponse.json({ message: error.message, success: success });
  } else {
    return NextResponse.json({ message: 'An unknown error occurred', success: success });
  }
};

const handleError = {
  toast: handleErrorToast,
  log: handleErrorLog,
  toastAndLog: handleErrorToastAndLog,
  throw: throwError,
  api: handleApiError,
};

export default handleError;
