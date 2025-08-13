import React from 'react'

function BuildModeProgress({ currentStep, totalSteps, buildModeConfig }) {
  const progressPercentage = (currentStep / totalSteps) * 100
  
  const getStepLabel = (step) => {
    const stepLabels = {
      0: 'Template Selection',
      1: 'Communication Style',
      2: 'Creativity Level',
      3: 'Response Length',
      4: 'Industry Terminology',
      5: 'Response Complexity',
      6: 'Interaction Style',
      7: 'Experience Level',
      8: 'Preferred Examples',
      9: 'Focus Areas',
      10: 'Custom Instructions'
    }
    return stepLabels[step] || `Step ${step + 1}`
  }
  
  const getCurrentConfig = () => {
    const config = []
    
    if (buildModeConfig.selectedTemplate) {
      config.push({ label: 'Template', value: buildModeConfig.selectedTemplate })
    }
    
    if (buildModeConfig.responseStyle) {
      config.push({ label: 'Style', value: buildModeConfig.responseStyle })
    }
    
    if (buildModeConfig.temperature !== undefined) {
      const creativityLabels = {
        0.3: 'Conservative',
        0.5: 'Balanced', 
        0.7: 'Creative',
        0.9: 'Very Creative'
      }
      config.push({ label: 'Creativity', value: creativityLabels[buildModeConfig.temperature] || 'Custom' })
    }
    
    if (buildModeConfig.maxTokens) {
      const lengthLabels = {
        150: 'Brief',
        300: 'Standard',
        500: 'Detailed',
        800: 'Comprehensive'
      }
      config.push({ label: 'Length', value: lengthLabels[buildModeConfig.maxTokens] || 'Custom' })
    }
    
    if (buildModeConfig.industryTerminology) {
      config.push({ label: 'Terminology', value: buildModeConfig.industryTerminology })
    }
    
    if (buildModeConfig.responseComplexity) {
      config.push({ label: 'Complexity', value: buildModeConfig.responseComplexity })
    }
    
    if (buildModeConfig.interactionPattern) {
      config.push({ label: 'Interaction', value: buildModeConfig.interactionPattern })
    }
    
    if (buildModeConfig.personalization?.experienceLevel) {
      config.push({ label: 'Experience', value: buildModeConfig.personalization.experienceLevel })
    }
    
    if (buildModeConfig.personalization?.preferredExamples) {
      config.push({ label: 'Examples', value: buildModeConfig.personalization.preferredExamples })
    }
    
    if (buildModeConfig.focusAreas && buildModeConfig.focusAreas.length > 0) {
      config.push({ label: 'Focus', value: buildModeConfig.focusAreas.join(', ') })
    }
    
    return config
  }
  
  return (
    <div className="build-mode-progress" style={{
      padding: '16px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      marginBottom: '16px'
    }}>
      {/* Progress Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#1e293b',
          margin: 0
        }}>Configuration Progress</h4>
        <span style={{
          fontSize: '12px',
          color: '#64748b',
          fontWeight: '500'
        }}>
          {currentStep}/{totalSteps} - {getStepLabel(currentStep)}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '6px',
        backgroundColor: '#e2e8f0',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '12px'
      }}>
        <div style={{
          width: `${progressPercentage}%`,
          height: '100%',
          backgroundColor: '#e60028',
          borderRadius: '3px',
          transition: 'width 0.3s ease'
        }} />
      </div>
      
      {/* Current Configuration */}
      {getCurrentConfig().length > 0 && (
        <div>
          <div style={{
            fontSize: '12px',
            fontWeight: '500',
            color: '#475569',
            marginBottom: '8px'
          }}>Current Configuration:</div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}>
            {getCurrentConfig().map((item, index) => (
              <div
                key={index}
                style={{
                  fontSize: '11px',
                  color: '#1e293b',
                  backgroundColor: '#ffffff',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: '500', marginRight: '4px' }}>{item.label}:</span>
                <span style={{ color: '#64748b' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BuildModeProgress