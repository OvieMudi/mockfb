export const serviceSuccessResponse = (data = {}, code = 200, message) => ({
  success: true,
  message,
  data,
  code,
});

export const serviceErrorResponse = (
  code = 500,
  message = 'Something went wrong'
) => ({
  success: false,
  code,
  message,
});
