import { NextResponse } from 'next/server';

const blockedCountries = ['CU', 'IR', 'KP'];

export const geoRestrict = (request) => {
  let country = request.geo?.country;

  if ( blockedCountries.some((cntr) => cntr === country)) {
    return new NextResponse('Access denied for your region', { status: 403 })
  }
}
