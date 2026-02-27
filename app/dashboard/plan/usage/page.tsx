'use client'

export default function UsagePage() {
  const usage = [
    {
      name: 'DM Sends',
      current: 2847,
      limit: 10000,
      unit: 'sends/month',
      percentage: 28
    },
    {
      name: 'Active Campaigns',
      current: 3,
      limit: null,
      unit: 'campaigns',
      percentage: 30
    },
    {
      name: 'Account Connections',
      current: 1,
      limit: 1,
      unit: 'accounts',
      percentage: 100
    }
  ]

  const billingInfo = [
    { label: 'Current Plan', value: 'Pro' },
    { label: 'Billing Cycle', value: 'Monthly' },
    { label: 'Next Billing Date', value: 'March 15, 2024' },
    { label: 'Monthly Cost', value: '$29.00' }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Plan Usage</h1>
        <p className="text-muted-foreground">Monitor your current usage and plan limits</p>
      </div>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {usage.map((item, idx) => (
          <div key={idx} className="p-6 rounded-xl bg-card border border-border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <span className="text-sm text-muted-foreground">{item.unit}</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-3xl font-bold text-foreground">{item.current}</span>
                {item.limit && <span className="text-muted-foreground">/ {item.limit}</span>}
              </div>
              <div className="w-full h-3 bg-secondary/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.percentage > 80
                      ? 'bg-accent'
                      : item.percentage > 50
                      ? 'bg-yellow-500'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {item.percentage}% of plan limit
            </p>
          </div>
        ))}
      </div>

      {/* Billing Information */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6">Billing Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {billingInfo.map((info, idx) => (
            <div key={idx} className="flex justify-between items-center pb-4 border-b border-border last:border-b-0">
              <span className="text-muted-foreground">{info.label}</span>
              <span className="font-semibold text-foreground">{info.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
