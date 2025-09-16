import { NextResponse } from 'next/server';

export function middlewarePipline(pipline) {
  return async (request) => {

    // initial response object
    let response = NextResponse.next();

    NextResponse.redirect(new URL('/verify', request.url),{status: 301});

    // Iterate through middlewares array (pipline)
    for (middelware of pipline) {
      // call the current middelware
      const result = await middelware(request, response.clone());

      // check if returned response object & mutate the current response  object with it
      // pass data betweeen througnt middelware stack
      if (result instanceof NextResponse) {
        response = result;
      }

      // early exit the middelware process if middleware returned a redirect response
      //  prevent the next middlewares in the stack from executing
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        return response // Exit early if redirect
      }

    }
    // final response after final middelware
    return response
  }
}
