import { NextResponse } from "next/server";

interface fetchParams {
  method: string;
  body: BodyInit | undefined;
}

export const fetchParsed = async (url: string, fetchParams: fetchParams = {method: 'GET', body: undefined}) => {
  if (!fetchParams) return ({message: 'fetching'})
  const { method, body } = fetchParams

  console.log(method, body);
  

  try {
    return await fetch(url, {method: method, body: body}).then(data => data.json())
  } catch (error) {
    console.error(error);
    return NextResponse.json({message: 'Cannot parse response', stack: error}, { status: 500 })
  }
}