import React from 'react'

function ConfigurationSummary({ buildModeConfig, onClose }) {
  const getSummaryData = () => {
    const sections = []
    
    // Basic Configuration
    const basicConfig = []
    if (buildModeConfig.selectedTemplate) {
      basicConfig.push({ label: 'Template', value: buildModeConfig.selectedTemplate, icon: '📋' })
    }
    if (buildModeConfig.responseStyle) {
      basicConfig.push({ label: 'Communication Style', value: buildModeConfig.responseStyle, icon: '💬' })
    }
    
    const creativityLabels = {
      0.3: 'Conservative',
      0.5: 'Balanced', 
      0.7: 'Creative',
      0.9: 'Very Creative'
    }
    if (buildModeConfig.temperature !== undefined) {
      basicConfig.push({ 
        label: 'Creativity Level', 
        value: creativityLabels[buildModeConfig.temperature] || 'Custom',
        icon: '🎨'
      })
    }
    
    const lengthLabels = {
      150: 'Brief',
      300: 'Standard',
      500: 'Detailed',
      800: 'Comprehensive'
    }
    if (buildModeConfig.maxTokens) {
      basicConfig.push({ 
        label: 'Response Length', 
        value: lengthLabels[buildModeConfig.maxTokens] || 'Custom',
        icon: '📏'
      })
    }
    
    if (basicConfig.length > 0) {
      sections.push({ title: 'Communication Settings', items: basicConfig })
    }
    
    // Advanced Modifiers
    const advancedConfig = []
    if (buildModeConfig.industryTerminology) {
      advancedConfig.push({ 
        label: 'Industry Terminology', 
        value: buildModeConfig.industryTerminology,
        icon: '🏛️'
      })
    }
    if (buildModeConfig.responseComplexity) {
      advancedConfig.push({ 
        label: 'Response Complexity', 
        value: buildModeConfig.responseComplexity,
        icon: '🧠'
      })
    }
    if (buildModeConfig.interactionPattern) {
      advancedConfig.push({ 
        label: 'Interaction Style', 
        value: buildModeConfig.interactionPattern,
        icon: '🤝'
      })
    }
    
    if (advancedConfig.length > 0) {
      sections.push({ title: 'Advanced Modifiers', items: advancedConfig })
    }
    
    // Personalization
    const personalizationConfig = []
    if (buildModeConfig.personalization?.experienceLevel) {
      personalizationConfig.push({ 
        label: 'Experience Level', 
        value: buildModeConfig.personalization.experienceLevel,
        icon: '📊'
      })
    }
    if (buildModeConfig.personalization?.preferredExamples) {
      personalizationConfig.push({ 
        label: 'Preferred Examples', 
        value: buildModeConfig.personalization.preferredExamples,
        icon: '💡'
      })
    }
    if (buildModeConfig.personalization?.communicationTone) {
      personalizationConfig.push({ 
        label: 'Communication Tone', 
        value: buildModeConfig.personalization.communicationTone,
        icon: '🎭'
      })
    }
    if (buildModeConfig.personalization?.followUpStyle) {
      personalizationConfig.push({ 
        label: 'Follow-up Style', 
        value: buildModeConfig.personalization.followUpStyle,
        icon: '🔄'
      })
    }
    
    if (personalizationConfig.length > 0) {
      sections.push({ title: 'Personalization', items: personalizationConfig })
    }
    
    // Focus Areas
    if (buildModeConfig.focusAreas && buildModeConfig.focusAreas.length > 0) {
      sections.push({ 
        title: 'Focus Areas', 
        items: [{ 
          label: 'Selected Areas', 
          value: buildModeConfig.focusAreas.join(', '),
          icon: '🎯'
        }]
      })
    }
    
    // Custom Instructions
    if (buildModeConfig.customInstructions) {
      sections.push({ 
        title: 'Custom Instructions', 
        items: [{ 
          label: 'Additional Preferences', 
          value: buildModeConfig.customInstructions,
          icon: '📝'
        }]
      })
    }
    
    return sections
  }
  
  const summaryData = getSummaryData()
  
  return (
    <div className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out'
      }}>
      <div className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '800px',
          maxHeight: '90vh',
          width: '90%',
          backgroundColor: '#ffffff',
          border: '2px solid #e60028',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          overflow: 'auto',
          animation: 'slideIn 0.3s ease-out'
        }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'sticky',
            top: '16px',
            left: 'calc(100% - 48px)',
            marginBottom: '-32px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280',
            zIndex: 1002,
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6'
            e.target.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.color = '#6b7280'
          }}
        >
          ×
        </button>
        
        <div className="configuration-summary" style={{
          padding: '24px'
        }}>
          <div className="summary-header" style={{
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '24px',
              marginBottom: '8px'
            }}>✨</div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '8px'
            }}>Your Custom Concierge is Ready!</h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>Here's a summary of your personalized configuration</p>
          </div>
          
          <div className="summary-sections" style={{
            display: 'grid',
            gap: '20px'
          }}>
            {summaryData.map((section, sectionIndex) => (
              <div key={sectionIndex} className="summary-section" style={{
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {section.title}
                </h4>
                <div className="summary-items" style={{
                  display: 'grid',
                  gap: '8px'
                }}>
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="summary-item" style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      padding: '8px 12px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <span style={{
                        fontSize: '16px',
                        marginRight: '8px',
                        flexShrink: 0
                      }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '2px'
                        }}>{item.label}</div>
                        <div style={{
                          fontSize: '13px',
                          color: '#6b7280',
                          lineHeight: '1.4'
                        }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-footer" style={{
            textAlign: 'center',
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#fef2f2',
            borderRadius: '12px',
            border: '1px solid #fecaca'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#7f1d1d',
              margin: 0,
              fontWeight: '500'
            }}>🎉 Your AI assistant is now personalized to your preferences!</p>
            <p style={{
              fontSize: '12px',
              color: '#991b1b',
              margin: '4px 0 0 0'
            }}>You can start chatting normally, and I'll respond according to your configuration.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigurationSummary