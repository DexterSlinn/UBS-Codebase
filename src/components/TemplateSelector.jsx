import React from 'react'

function TemplateSelector({ onSelectTemplate, onCustomConfig }) {
  const templates = [
    {
      id: 'Student',
      title: '🎓 Student',
      description: 'Simple explanations, educational focus, budget-conscious advice',
      features: ['Basic terminology', 'Educational content', 'Budget tips']
    },
    {
      id: 'Young Professional',
      title: '💼 Young Professional',
      description: 'Career-focused advice, investment basics, goal-oriented planning',
      features: ['Career planning', 'Investment basics', 'Goal setting']
    },
    {
      id: 'Investor',
      title: '📈 Investor',
      description: 'Market insights, portfolio analysis, advanced investment strategies',
      features: ['Market analysis', 'Portfolio insights', 'Advanced strategies']
    },
    {
      id: 'Business Owner',
      title: '🏢 Business Owner',
      description: 'Business banking, cash flow management, commercial solutions',
      features: ['Business banking', 'Cash flow', 'Commercial solutions']
    },
    {
      id: 'Retiree',
      title: '🏖️ Retiree',
      description: 'Retirement planning, income preservation, estate considerations',
      features: ['Retirement focus', 'Income preservation', 'Estate planning']
    },
    {
      id: 'Wealth Manager',
      title: '💎 Wealth Manager',
      description: 'High-net-worth strategies, sophisticated analysis, exclusive insights',
      features: ['HNW strategies', 'Sophisticated analysis', 'Exclusive insights']
    }
  ]

  return (
    <div className="template-selector">
      <div className="template-selector-header">
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '8px',
          textAlign: 'center'
        }}>Choose Your Profile</h3>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: '20px'
        }}>Select a preset template or customize your own experience</p>
      </div>
      
      <div className="template-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className="template-card"
            style={{
              padding: '16px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              height: '120px'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#e60028';
              e.target.style.backgroundColor = '#fef2f2';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(230, 0, 40, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '6px'
            }}>
              {template.title}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#6b7280',
              marginBottom: '8px',
              lineHeight: '1.4',
              flex: 1
            }}>
              {template.description}
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px'
            }}>
              {template.features.map((feature, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: '11px',
                    color: '#4b5563',
                    backgroundColor: '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      
      <div className="custom-option" style={{
        textAlign: 'center',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <button
          onClick={onCustomConfig}
          style={{
            color: '#e60028',
            fontSize: '14px',
            fontWeight: '500',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#cc0024';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#e60028';
          }}
        >
          Or customize your own configuration →
        </button>
      </div>
    </div>
  )
}

export default TemplateSelector