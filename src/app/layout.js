import React from 'react';

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>TaxiT</title>
      </head>
      <body style={{ margin: 0 }}>
        <header style={{ background: '#333', color: '#fff', padding: '10px', position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
          <h1>TaxiT</h1>
        </header>
        <main style={{ paddingTop: '100px', paddingBottom: '50px' }}>{children}</main>
        <footer>
        </footer>
      </body>
    </html>
  );
};

export default Layout;