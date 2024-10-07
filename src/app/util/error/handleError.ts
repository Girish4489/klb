import { NextResponse } from 'next/server';
import toast from 'react-hot-toast';

const handleErrorToast = (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An unknown error occurred');
  }
};

const handleErrorLog = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('An unknown error occurred');
  }
};

const handleErrorToastAndLog = (error: unknown) => {
  handleErrorLog(error);
  handleErrorToast(error);
};

const throwError = (error: unknown) => {
  if (error instanceof Error) {
    throw new Error(error.message);
  } else {
    throw new Error('An unknown error occurred');
  }
};

const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    return NextResponse.json({ message: error.message });
  } else {
    return NextResponse.json({ message: 'An unknown error occurred' });
  }
};

const handleApiErrorWithSuccess = (error: unknown, success: boolean) => {
  if (error instanceof Error) {
    return NextResponse.json({ message: error.message, success: success });
  } else {
    return NextResponse.json({ message: 'An unknown error occurred', success: (success = false) });
  }
};

const handleError = {
  toast: handleErrorToast,
  log: handleErrorLog,
  toastAndLog: handleErrorToastAndLog,
  throw: throwError,
  api: handleApiError,
  apiSuccess: handleApiErrorWithSuccess,
};

export default handleError;
