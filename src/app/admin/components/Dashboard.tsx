export const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">Typify Admin Dashboard</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="border rounded-lg p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold">Total Users</h3>
        </div>
        <div>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold">Posts Created</h3>
        </div>
        <div>
          <div className="text-2xl font-bold">5,432</div>
          <p className="text-xs text-muted-foreground">
            +35.2% from last month
          </p>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold">Active Subscriptions</h3>
        </div>
        <div>
          <div className="text-2xl font-bold">234</div>
          <p className="text-xs text-muted-foreground">
            +12.5% from last month
          </p>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold">Revenue</h3>
        </div>
        <div>
          <div className="text-2xl font-bold">$4,567</div>
          <p className="text-xs text-muted-foreground">
            +45.3% from last month
          </p>
        </div>
      </div>
    </div>
    
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <p className="text-gray-500">Activity feed will be displayed here...</p>
    </div>
  </div>
)