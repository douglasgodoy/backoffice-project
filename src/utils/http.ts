import { Response } from 'express';

export const CREATED_HTTP_RESPONSE = (
  res: Response,
  data?: Record<string, unknown>,
  message = '',
) => {
  return res.status(201).json({ ok: true, data, message });
};

export const BAD_REQUEST_HTTP_RESPONSE = (
  res: Response,
  data?: Record<string, unknown>,
  message = '',
) => {
  return res.status(400).json({ ok: false, data, message });
};

export const INTERNAL_SERVER_ERROR_HTTP_RESPONSE = (
  res: Response,
  data?: Record<string, unknown>,
) => {
  return res
    .status(500)
    .json({ ok: false, data, message: 'Internal Server Error' });
};

export const NOT_FOUND_HTTP_RESPONSE = (res: Response, message?: string) => {
  return res.status(404).json({ ok: false, message });
};

export const NOT_AUTHORIZED_HTTP_RESPONSE = (
  res: Response,
  message?: string,
) => {
  return res.status(401).json({ ok: false, message });
};

export const SUCCESS_HTTP_RESPONSE = (
  res: Response,
  data?: Record<string, unknown>,
  message = '',
) => {
  return res.status(200).json({ ok: true, data, message });
};
