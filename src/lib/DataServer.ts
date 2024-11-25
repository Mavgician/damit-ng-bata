import { NextResponse } from "next/server";

interface fetchParams {
  method: string;
  body: BodyInit | undefined;
}

export const fetchParsed = async (url: string, fetchParams: fetchParams = {method: 'GET', body: undefined}) => {
  if (!fetchParams) return ({message: 'fetching'})
  const { method, body } = fetchParams
  const res = await fetch(url, {method: method, body: body, headers: {'Content-Type': 'application/json'}})

  try {
    return await res.json()
  } catch (error) {
    console.error(error);
    return ({message: 'Cannot parse response', stack: error})
  }
}