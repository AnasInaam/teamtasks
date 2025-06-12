import React from 'react';

const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return <div className="text-red-600 text-center">{message}</div>;
};

export default ErrorMessage;
