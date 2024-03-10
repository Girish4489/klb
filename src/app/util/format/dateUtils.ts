const formatDate = (dateString: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', options);
};

const formatDateWithSlash = (dateString: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', options).replace(/-/g, '/');
};

const formatDateWithSlashWithoutTime = (dateString: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', options).replace(/-/g, '/');
};

export { formatDate, formatDateWithSlash, formatDateWithSlashWithoutTime };
