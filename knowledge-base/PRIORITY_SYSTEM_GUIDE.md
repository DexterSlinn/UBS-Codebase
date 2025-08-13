# UBS Knowledge Base Priority System Guide

```yaml
priority: 2.0
search_keywords:
  - priority
  - prioritization
  - knowledge base
  - documentation
  - guide
alias_terms:
  - priority guide
  - prioritization system
  - knowledge management
use_cases:
  - understanding priority system
  - configuring document priorities
  - knowledge base management
example_scenarios:
  - "How does the priority system work?"
  - "How to set document priorities?"
  - "Managing knowledge base priorities"
```

## Overview

The UBS Knowledge Base now supports **manual priority settings** for individual documents, allowing you to control which information appears first in search results.

## How Priority Works

### Priority Levels
- **Range**: 0.1 to 10.0
- **Default**: Automatic calculation (typically 1.0 - 5.0)
- **Higher numbers** = Higher priority in search results
- **Manual priority** always overrides automatic calculation

### Current File Priorities
1. **ubs-key4-banking-priority.md** - Priority: 9.0 (Highest)
2. **ubs-investment-priority.md** - Priority: 7.0 (High)
3. **ubs-services.md** - Priority: 3.0 (Medium)
4. **PRIORITY_SYSTEM_GUIDE.md** - Priority: 2.0 (Low)
5. **Other files** - Automatic calculation (varies)

## Setting Manual Priorities

### YAML Configuration Block
Add this YAML block at the top of any knowledge base file:

```yaml
priority: 8.5
search_keywords:
  - your
  - keywords
  - here
alias_terms:
  - alternative terms
  - synonyms
use_cases:
  - specific use cases
example_scenarios:
  - "Example user questions"
```

### Priority Guidelines

#### **Critical Information (8.0 - 10.0)**
- Account opening procedures
- Emergency contact information
- Security and fraud prevention
- Regulatory compliance information

#### **High Priority (6.0 - 7.9)**
- Core banking services
- Investment products
- Wealth management services
- Digital banking features

#### **Medium Priority (3.0 - 5.9)**
- General service information
- Contact details
- Branch locations
- Standard procedures

#### **Low Priority (1.0 - 2.9)**
- Documentation and guides
- Historical information
- Supplementary content
- Reference materials

## Automatic Priority Calculation

When no manual priority is set, the system automatically calculates priority based on:

### Content Factors
- **Base priority**: 1.0
- **Alias terms**: +0.5
- **Search keywords**: +0.5
- **Use cases**: +0.3
- **Example scenarios**: +0.3
- **Word count > 1000**: +0.5
- **Word count > 2000**: +0.5
- **YAML blocks**: +0.2 per block
- **Maximum automatic**: 5.0

## Best Practices

### 1. Strategic Prioritization
- Prioritize customer-facing information
- Ensure critical processes rank highest
- Balance between different service areas

### 2. Regular Review
- Review priorities quarterly
- Adjust based on customer feedback
- Monitor search result effectiveness

### 3. Content Quality
- High priority = high responsibility
- Ensure accuracy of prioritized content
- Keep high-priority files updated

### 4. Keyword Optimization
- Include comprehensive search keywords
- Add relevant alias terms
- Define clear use cases

## Testing Priority Changes

### 1. Server Restart Required
After changing priorities:
```bash
# Stop the server
# Restart with: node index.js
```

### 2. Test Search Queries
Try searches related to:
- "key4" or "student banking" (should show key4 banking file first)
- "investment" (should show investment file first)
- "banking services" (should show services file)

### 3. Monitor Logs
Check server logs for:
- Document loading confirmation
- Priority assignments
- Search result rankings

## Advanced Features

### Multiple File Coordination
- **Complementary priorities**: Different aspects of same topic
- **Hierarchical structure**: General → Specific information
- **Seasonal adjustments**: Temporary priority boosts

### Search Result Impact
- Priority affects **relevance scoring**
- Higher priority documents appear **first**
- Maintains **content relevance** matching
- Balances **priority** with **search accuracy**

## Troubleshooting

### Priority Not Working
1. Check YAML syntax
2. Ensure server restart
3. Verify priority range (0.1-10.0)
4. Check for parsing errors in logs

### Unexpected Results
1. Review search keywords
2. Check content relevance
3. Verify priority values
4. Test with different queries

## Future Enhancements

### Planned Features
- **Category-based priorities**: Different priorities per topic
- **Time-based priorities**: Automatic priority decay
- **Usage-based priorities**: Priority based on access frequency
- **A/B testing**: Priority effectiveness measurement

---

**For technical support**: Contact the development team
**For content updates**: Follow the priority guidelines above