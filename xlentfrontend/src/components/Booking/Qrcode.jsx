import React from 'react';

const Qrcode = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h2 style={styles.title}>Complete Payment</h2>
          <p style={styles.subtitle}>Scan the QR code using any UPI or payment app</p>
        </header>

        <div style={styles.qrWrapper}>
          <img
            src="/QrcodeScan.jpeg"
            alt="Payment QR Code"
            style={styles.qrImage}
          />
        </div>

        <footer style={styles.footer}>
          <div style={styles.statusIndicator}>
            <span style={styles.pulse}></span>
            <p style={styles.warningText}>Waiting for payment confirmation...</p>
          </div>
          <p style={styles.subtext}>Please do not close or refresh this page</p>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f7f6', // Light neutral background
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  qrWrapper: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #eee',
    marginBottom: '30px',
  },
  qrImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    display: 'block',
  },
  footer: {
    marginTop: '20px',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  pulse: {
    width: '8px',
    height: '8px',
    backgroundColor: '#34d399', // Modern green
    borderRadius: '50%',
    boxShadow: '0 0 0 0 rgba(52, 211, 153, 1)',
    animation: 'pulse 2s infinite',
  },
  warningText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  subtext: {
    fontSize: '12px',
    color: '#999',
    margin: 0,
  },
};

export default Qrcode;