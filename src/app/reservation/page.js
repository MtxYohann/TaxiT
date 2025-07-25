export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import ChauffeursClientWrapper from './ClientContent';

export default function ReservationPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ChauffeursClientWrapper />
    </Suspense>
  );
}
