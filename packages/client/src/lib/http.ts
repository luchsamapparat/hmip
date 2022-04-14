import fetch from 'node-fetch';

export async function post<R, T = unknown>(
  url: string,
  body: T,
  headers: Record<string, string> = {}
): Promise<R> {
  const response = await postRequest<T>(url, body, headers);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = await response.json() as unknown as R;

  // console.debug(json);

  return json;
}

export async function postRequest<T = unknown>(
  url: string,
  body: T,
  headers: Record<string, string> = {}
) {
  // console.debug('📤 POST', url, headers, body);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }
  });

  // console.debug('📥', response.status, response.statusText);

  return response;
}
