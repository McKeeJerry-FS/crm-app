export default function Home() {
  return (
    <div>
      <h1>Welcome to CRM App</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Manage your customers, contacts, and deals efficiently.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <a href="/customers" className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2>📋 Customers</h2>
          <p>View and manage your customer base</p>
        </a>
        
        <a href="/contacts" className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2>👥 Contacts</h2>
          <p>Track all your business contacts</p>
        </a>
        
        <a href="/deals" className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2>💼 Deals</h2>
          <p>Monitor your sales pipeline</p>
        </a>
      </div>
    </div>
  );
}

