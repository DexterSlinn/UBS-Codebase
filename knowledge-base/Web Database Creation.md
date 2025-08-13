---
title: UBS Banking Services Knowledge Base
version: 1.0
last_updated: 2024
content_scope: Complete UBS service offerings from ubs.com/ch
source: UBS Official Website Switzerland
keywords: banking, accounts, cards, payments, investments, wealth management, mortgages, pensions, UBS Switzerland, Swiss banking, Bancomat, CHF, EUR, TWINT, eBill, QR-bill, SEPA, SARON, pillar 3a, pillar 3b, Keyclub, e-banking, mobile banking, private banking, corporate banking, asset management, investment bank
swiss_terms: Bancomat, LSV, QR-Rechnung, Säule 3a, Säule 3b, Hypothek, Sparkonto, Privatkonto, Geschäftskonto, Zahlungsverkehr, Vermögensverwaltung, Anlageberatung
alternative_terms: checking account, current account, savings account, debit card, credit card, wire transfer, money transfer, home loan, retirement planning, investment management, online banking, internet banking
service_categories: private clients, corporate clients, asset management, investment banking, digital banking, wealth planning, mortgage financing, pension planning, payment solutions
product_names: UBS TWINT, UBS Vitainvest, UBS key4, FX-EQUI, UBS Marketplace, Keyclub
currencies: CHF, EUR, USD, GBP, JPY, over 130 currencies
locations: Switzerland, Zurich, Geneva, Basel, over 200 branches
contact: +41 44 234 1111, info@ubs.com, ubs.com/ch
---

# UBS Banking Services Knowledge Base

## Table of Contents
- [Private Clients](#private-clients)
  - [Accounts and Cards](#accounts-and-cards)
  - [Payment Transactions](#payment-transactions)
  - [Mortgages](#mortgages)
  - [Pensions](#pensions)
  - [Investing](#investing)
  - [Keyclub](#keyclub)
  - [Digital Banking](#digital-banking)
  - [Wealth Management](#wealth-management)
- [Corporate Clients](#corporate-clients)
- [Asset Management](#asset-management)
- [Investment Bank](#investment-bank)
- [About UBS](#about-ubs)

---

## Homepage

### Private Clients

#### Accounts and Cards

##### Accounts: Day to Day Banking

**Personal Accounts**
```yaml
service_type: banking_account
category: personal_banking
product_id: personal_account
alias_terms: ["checking accounts", "current accounts", "everyday banking", "Privatkonto", "Lohnkonto", "Gehaltskonto"]
currencies: ["CHF", "EUR"]
pricing:
  monthly_fee: "CHF 8"
  promotion: "6 months free for UBS me banking package"
features:
  - "Free cash withdrawal at UBS/CS Bancomats"
  - "Swiss ATM network access"
eligibility: ["adults", "youth", "students", "couples", "families", "cross-border clients", "private clients"]
search_keywords: ["personal banking", "daily banking", "salary account", "main account", "primary account"]
```

**Current Account for Private Clients**
```yaml
service_type: banking_account
category: current_account
product_id: current_account_private
purpose: "Basis for payment and securities transactions"
features:
  - "Always-accessible balance"
  - "No account-closing fees"
  - "No transaction posting fees"
pricing:
  digital: "CHF 5"
  paper: "CHF 9"
currencies: ["CHF", "foreign currencies"]
```

**Savings Accounts**
```yaml
service_type: banking_account
category: savings
product_id: savings_account
alias_terms: ["deposit accounts", "savings plans", "Sparkonto", "Sparbuch", "Einlagenkonto", "Mietkaution"]
purpose: "Regularly set aside money while maintaining flexibility"
eligibility: ["adults", "youth", "students", "rental surety deposits"]
benefits:
  - "Complement personal account"
  - "Support short-term financial goals"
  - "Support long-term financial goals"
search_keywords: ["save money", "interest account", "deposit account", "emergency fund", "rainy day fund", "Zinsen", "Ersparnisse"]
```

**Cards and TWINT**
```yaml
service_type: payment_solutions
category: cards_and_mobile_payments
alias_terms: ["payment cards", "mobile payments", "Kreditkarte", "Debitkarte", "Prepaidkarte"]
products:
  credit_prepaid_cards:
    product_id: credit_prepaid_cards
    description: "Secure, flexible payments worldwide with insurance benefits and KeyClub bonus points"
    features: ["worldwide acceptance", "travel insurance", "purchase protection", "KeyClub bonus points"]
    search_keywords: ["Visa", "Mastercard", "travel insurance", "purchase protection", "cashback", "rewards"]
  debit_cards:
    product_id: debit_cards
    description: "Safe everyday payment—online, in stores, ATM withdrawals—with contactless capability"
    features: ["contactless payment", "online payments", "in-store payments", "ATM withdrawals", "NFC technology"]
    search_keywords: ["contactless payment", "NFC", "PIN", "chip card", "Bancomat card", "EC-Karte"]
  ubs_twint:
    product_id: ubs_twint
    description: "Switzerland's most popular payment app (Swiss mobile payment solution)"
    features:
      - "Instant transfers between smartphones"
      - "QR code payments in shops"
      - "Online payments"
      - "In-app purchases"
      - "Parking payments"
      - "Vouchers"
      - "Charity donations"
    search_keywords: ["mobile wallet", "digital payment", "QR payment", "peer-to-peer transfer", "P2P", "instant payment", "Swiss payment app"]
```

**Manage Accounts and Cards** (also known as: account management, card controls)
- Online management: Track purchases, balances, block/unblock cards, adjust limits, view statements
- E‑Banking self‑service (24/7): Block cards, change PIN, adjust card/location limits, review documents, notifications
- Bank switching assistance: Account, card, securities transfer, notify payers, adjust standing payments

**Guide Accounts and Cards** (also known as: banking guides, financial education)
- Free guides and publications with practical tips
- Budget calculator and budgeting tools
- Youth newsletters
- Detailed guides for combining accounts and cards

##### Payment Transactions

**Overview**
```yaml
service_type: payment_services
category: payment_transactions
alias_terms: ["money transfers", "payments", "banking transactions", "Zahlungsverkehr", "Überweisungen", "Zahlungen"]
key_categories:
  - "Pay Invoices"
  - "Receive Money"
  - "International Transfers"
access_channels: ["E-Banking", "Mobile Banking"]
integrations:
  - "UBS TWINT for instant mobile payments"
  - "FX-EQUI for multi-currency payments"
  - "UBS key4 FX for currency exchange"
features:
  - "End-to-end payment tracking"
  - "Real-time status updates"
  - "Charge transparency"
  - "Exchange rate visibility"
services: ["SEPA", "Gateway Account", "Pay Worldwide"]
search_keywords: ["send money", "transfer funds", "wire transfer", "SWIFT", "IBAN", "BIC", "payment order", "Auftrag", "Überweisung"]
```

**Pay Invoices**
```yaml
service_type: payment_services
category: invoice_payment
alias_terms: ["bill payment", "invoice payment", "Rechnungen bezahlen", "Rechnungsstellung"]
description: "Comprehensive invoice payment solutions for individuals and businesses, offering multiple payment methods to suit different needs and preferences"
payment_methods:
  ebill:
    product_id: ebill
    description: "Receive, review, and approve invoices directly in Digital/Mobile Banking (fully digital, no manual input)"
    features: ["fully digital", "no manual input", "direct banking integration", "invoice archiving", "payment history tracking"]
    use_cases:
      - "Utility bill payments (electricity, gas, water)"
      - "Telecommunications invoices (mobile, internet, TV)"
      - "Insurance premium payments"
      - "Municipal tax payments"
    example_scenarios:
      - "Customer receives Swisscom invoice via eBill, reviews charges in UBS app, and approves payment with one tap"
      - "Business receives multiple supplier invoices digitally, batch approves payments during monthly review"
    search_keywords: ["electronic billing", "digital invoices", "paperless billing", "e-Rechnung"]
  qr_bills:
    product_id: qr_bills
    description: "Scan invoice details from QR code using apps (no manual typing of reference numbers or IBANs)"
    features: ["QR code scanning", "automated data entry", "mobile app integration", "error reduction", "payment verification"]
    use_cases:
      - "Restaurant bill payments"
      - "Medical invoice payments"
      - "Online shopping payments"
      - "Service provider invoices"
    example_scenarios:
      - "Customer scans QR code on restaurant bill, payment details auto-populate, confirms payment in seconds"
      - "Patient receives medical invoice with QR code, scans with UBS app, payment processed without manual entry"
    search_keywords: ["QR-Rechnung", "Swiss QR Code", "QR payment slip", "scan to pay", "mobile scanning"]
  direct_debit_lsv:
    product_id: direct_debit_lsv
    description: "Authorized billers automatically debit recurring payments (easy revocation available)"
    features: ["automatic payment", "recurring billing", "easy revocation", "payment notifications", "spending control"]
    use_cases:
      - "Monthly subscription services"
      - "Gym membership fees"
      - "Magazine subscriptions"
      - "Software license payments"
    example_scenarios:
      - "Netflix subscription automatically debited monthly, customer receives notification, can revoke anytime"
      - "Gym membership fee processed automatically, customer sets spending alerts for monitoring"
    search_keywords: ["Lastschriftverfahren", "automatic payment", "recurring billing", "subscription payment"]
  standing_orders:
    product_id: standing_orders
    description: "Set up for predictable bills (rent, insurance) with customizable frequency and alerts"
    features: ["customizable frequency", "payment alerts", "predictable billing", "end date settings", "amount modifications"]
    use_cases:
      - "Monthly rent payments"
      - "Annual insurance premiums"
      - "Quarterly tax payments"
      - "Regular savings transfers"
    example_scenarios:
      - "Tenant sets up monthly rent payment of CHF 1,500 on the 1st of each month with email notifications"
      - "Business owner schedules quarterly VAT payments with automatic amount adjustments"
    search_keywords: ["Dauerauftrag", "automatic transfer", "recurring payment", "scheduled payment"]
  instant_payments:
    product_id: instant_payments
    description: "Available 24/7 with immediate execution and account updates"
    features: ["24/7 availability", "immediate execution", "real-time updates", "instant confirmation", "emergency payments"]
    use_cases:
      - "Urgent bill payments"
      - "Last-minute transfers"
      - "Emergency payments"
      - "Time-sensitive transactions"
    example_scenarios:
      - "Customer realizes utility bill due today, makes instant payment at 11 PM, receives immediate confirmation"
      - "Business needs to pay supplier urgently to avoid delivery delay, processes instant payment on weekend"
    search_keywords: ["real-time payment", "immediate transfer", "instant transfer", "sofortige Überweisung"]
security_features: ["two-factor authentication", "transaction limits", "fraud monitoring", "secure encryption"]
compatibility: ["iOS app", "Android app", "web browser", "tablet devices"]
```

**Receive Money**
```yaml
service_type: payment_services
category: payment_collection
alias_terms: ["payment collection", "invoice collection", "Geld erhalten", "Zahlungseingang"]
description: "Comprehensive payment collection solutions for businesses and individuals to receive payments efficiently through multiple channels"
collection_methods:
  qr_bills:
    product_id: qr_bills_collection
    description: "Embed invoice and payment details in standardized Swiss QR format for easy customer payments"
    features: ["standardized Swiss QR format", "automated reconciliation", "reduced payment errors", "faster processing"]
    use_cases:
      - "Small business invoicing"
      - "Freelancer payment collection"
      - "Event ticket sales"
      - "Service provider billing"
    example_scenarios:
      - "Plumber generates QR bill for repair service, customer scans and pays instantly via mobile banking"
      - "Online shop includes QR code in invoice, customer pays without entering bank details manually"
    search_keywords: ["QR invoice generation", "Swiss QR standard", "payment collection", "invoice QR code"]
  digital_invoicing_ebill:
    product_id: digital_invoicing_ebill
    description: "Send invoices directly into customers' E-Banking systems for seamless digital payment processing"
    features: ["direct e-banking integration", "automatic invoice delivery", "payment tracking", "reduced paper usage"]
    use_cases:
      - "Utility company billing"
      - "Subscription service invoicing"
      - "Professional service billing"
      - "B2B invoice processing"
    example_scenarios:
      - "Insurance company sends premium invoice via eBill, customer sees it in UBS e-banking, pays with one click"
      - "Consulting firm sends monthly retainer invoice digitally, client approves payment during banking session"
    search_keywords: ["digital invoicing", "e-banking integration", "electronic billing", "paperless invoicing"]
  direct_debit_lsv:
    product_id: direct_debit_collection
    description: "Automated payment collection system for subscription billing with improved liquidity planning"
    features: ["automated collection", "predictable cash flow", "reduced collection costs", "customer convenience"]
    use_cases:
      - "Gym membership fees"
      - "Magazine subscriptions"
      - "Software license fees"
      - "Insurance premiums"
    example_scenarios:
      - "Fitness center collects monthly membership fees automatically, members receive advance notifications"
      - "SaaS company processes monthly subscriptions via LSV, improving cash flow predictability"
    search_keywords: ["direct debit collection", "subscription billing", "automated payment collection", "LSV system"]
  paper_based_transactions:
    product_id: paper_transactions
    description: "Traditional payment collection methods including check collection and payment slips, especially for cross-border transactions"
    features: ["check processing", "payment slip handling", "cross-border compatibility", "traditional payment support"]
    use_cases:
      - "International client payments"
      - "Traditional customer preferences"
      - "Cross-border transactions"
      - "Legacy system integration"
    example_scenarios:
      - "Export company receives international payments via traditional bank transfers and checks"
      - "Local business accommodates elderly customers who prefer paper-based payment methods"
    search_keywords: ["check collection", "payment slips", "traditional payments", "cross-border collection"]
  ubs_marketplace:
    product_id: ubs_marketplace
    description: "Accept payments via cards or TWINT through online and in-person partner solutions"
    features: ["card payment acceptance", "TWINT integration", "online payment processing", "in-person solutions"]
    use_cases:
      - "E-commerce payment processing"
      - "Retail point-of-sale payments"
      - "Mobile payment acceptance"
      - "Multi-channel payment solutions"
    example_scenarios:
      - "Online retailer integrates UBS Marketplace for card payments, customers pay securely during checkout"
      - "Market vendor uses TWINT via UBS partner solution to accept mobile payments at farmers market"
    search_keywords: ["card payment acceptance", "TWINT payments", "payment processing", "merchant solutions"]
target_customers: ["small businesses", "freelancers", "e-commerce merchants", "service providers", "subscription businesses"]
integration_options: ["API integration", "plugin solutions", "manual processing", "partner integrations"]
security_features: ["PCI compliance", "fraud protection", "secure data transmission", "transaction monitoring"]
```

**International Transfers**
```yaml
service_type: payment_services
category: international_transfers
alias_terms: ["wire transfers", "foreign payments", "cross-border payments", "Auslandsüberweisungen", "internationale Zahlungen"]
description: "Comprehensive international payment solutions supporting global money transfers with competitive rates and real-time tracking"
key_features:
  currency_support:
    description: "Support for over 130 currencies worldwide"
    features: ["130+ currencies", "major and exotic currencies", "real-time exchange rates", "currency conversion"]
    use_cases:
      - "Business payments to international suppliers"
      - "Personal remittances to family abroad"
      - "Property purchases in foreign countries"
      - "International investment transactions"
    example_scenarios:
      - "Swiss company pays USD invoice to US supplier, conversion handled automatically"
      - "Expat sends monthly support to family in Philippines using competitive PHP rates"
  account_flexibility:
    description: "No separate accounts required for international transfers"
    features: ["single account operation", "multi-currency handling", "simplified management", "consolidated reporting"]
    benefits: ["reduced complexity", "lower maintenance costs", "unified account view", "streamlined operations"]
  fx_rates:
    description: "Competitive foreign exchange rates via FX-EQUI or key4 FX subscription"
    options:
      fx_equi:
        description: "Professional FX platform for competitive rates"
        features: ["real-time rates", "professional trading platform", "rate alerts", "market analysis"]
        target_users: ["businesses", "frequent traders", "high-volume transfers"]
      key4_fx_subscription:
        description: "Preferential FX rates for key4 customers"
        features: ["discounted rates", "subscription benefits", "simplified access", "cost savings"]
        target_users: ["key4 customers", "regular international transfers", "cost-conscious users"]
    search_keywords: ["foreign exchange", "FX rates", "currency conversion", "exchange rates"]
specialized_services:
  sepa:
    product_id: sepa_transfers
    description: "Fast, secure, low-cost euro payments and direct debits for European eurozone (B2C and B2B)"
    features: ["eurozone coverage", "low-cost transfers", "fast processing", "direct debit capability"]
    coverage: "36 SEPA countries including EU, EEA, and associated territories"
    use_cases:
      - "Euro payments within Europe"
      - "European supplier payments"
      - "Eurozone property transactions"
      - "European subscription services"
    example_scenarios:
      - "Swiss business pays German supplier via SEPA, funds arrive same day at low cost"
      - "Individual transfers euros to French property purchase, benefiting from SEPA efficiency"
    search_keywords: ["SEPA transfers", "eurozone payments", "European transfers", "euro payments"]
tracking_and_transparency:
  real_time_tracking:
    description: "Comprehensive transfer tracking with status updates, fees, and conversion rates"
    features: ["real-time status updates", "fee transparency", "conversion rate visibility", "delivery confirmation"]
    channels: ["Digital Banking", "Mobile Banking", "SWIFT notifications", "email alerts"]
    tracking_stages: ["payment initiated", "funds debited", "in transit", "currency converted", "delivered"]
  cost_allocation:
    description: "Flexible fee allocation options defining who bears transfer costs"
    options:
      sha:
        description: "Shared costs - sender pays sending bank fees, receiver pays receiving bank fees"
        use_cases: ["standard business transfers", "balanced cost sharing", "routine payments"]
      our:
        description: "Sender pays all fees including intermediary and receiving bank charges"
        use_cases: ["ensuring exact amount delivery", "premium service", "important payments"]
      ben:
        description: "Receiver pays all fees, amount may be deducted from transfer"
        use_cases: ["cost-effective sending", "large volume transfers", "specific agreements"]
security_features: ["SWIFT network", "encrypted transmission", "fraud monitoring", "compliance screening"]
processing_times:
  same_day: ["SEPA transfers", "major currency pairs", "established corridors"]
  next_day: ["most developed markets", "USD, EUR, GBP transfers", "business days"]
  2_3_days: ["emerging markets", "exotic currencies", "complex routing"]
search_keywords: ["international transfer", "wire transfer", "foreign payment", "cross-border", "SWIFT", "overseas payment"]
```

##### Mortgages

**Overview**
```yaml
service_type: financing
category: mortgages
alias_terms: ["home loans", "property financing", "real estate loans", "Hypothek", "Immobilienfinanzierung", "Eigenheimfinanzierung"]
description: "UBS offers comprehensive mortgage solutions for property purchase, construction, and renovation"
services:
  - "Expert advisory services for first-time buyers"
  - "Expert advisory services for existing homeowners"
  - "Competitive interest rates"
  - "Flexible repayment options"
search_keywords: ["buy house", "home purchase", "property loan", "real estate financing", "Wohneigentum", "Eigenheim", "Immobilie kaufen", "Hauskauf"]
```

**Mortgage Products**
```yaml
service_type: financing
category: mortgage_products
products:
  fixed_rate_mortgages:
    product_id: fixed_rate_mortgage
    description: "Predictable payments with locked interest rates"
    features: ["locked interest rates", "predictable payments", "rate protection"]
    search_keywords: ["Festhypothek", "fixed interest", "locked rate", "predictable payments"]
  variable_rate_mortgages:
    product_id: variable_rate_mortgage
    description: "Flexible rates that adjust with market conditions"
    features: ["market-adjusted rates", "flexible interest", "rate flexibility"]
    search_keywords: ["variable Hypothek", "adjustable rate", "flexible interest", "market rate"]
  saron_mortgages:
    product_id: saron_mortgage
    description: "Based on Swiss Average Rate Overnight reference rate (Swiss benchmark rate)"
    features: ["Swiss benchmark rate", "overnight rate reference", "transparent pricing"]
    search_keywords: ["SARON rate", "Swiss reference rate", "overnight rate", "benchmark mortgage"]
  construction_loans:
    product_id: construction_loan
    description: "Financing for new builds and major renovations"
    features: ["new construction financing", "renovation financing", "flexible disbursement"]
    search_keywords: ["Baukredit", "construction financing", "building loan", "renovation loan", "Umbaukredit"]
```

**Mortgage Services** (also known as: home financing advice, property loan consultation)
- Personal mortgage consultation and affordability assessment
- Online mortgage calculator and application tools
- Property valuation services
- Insurance coordination (building, household contents)
- Renovation financing and energy efficiency upgrades

##### Pensions

**Overview**
```yaml
service_type: retirement_planning
category: pensions
alias_terms: ["retirement planning", "pension schemes", "retirement savings", "Altersvorsorge", "Pensionsplanung", "Rente"]
description: "Comprehensive retirement planning across all three pillars of Swiss pension system (3-Säulen-System)"
services:
  - "Expert advice for optimizing retirement income"
  - "Tax efficiency optimization"
  - "Flexible solutions for employed individuals"
  - "Flexible solutions for self-employed individuals"
search_keywords: ["retirement planning", "pension advice", "3 pillar system", "AHV", "BVG", "Säule 3a", "Säule 3b", "Vorsorge", "Rente planen"]
```

**Pillar 3a (Tied Pension Provision)**
```yaml
service_type: retirement_planning
category: pillar_3a
product_id: pillar_3a
alias_terms: ["tax-advantaged retirement savings", "Säule 3a", "gebundene Vorsorge"]
features:
  - "Annual contribution limits with tax deductions (Steuerabzug)"
  - "Investment options: savings accounts and securities solutions"
  - "Flexible withdrawal conditions (home purchase, self-employment, emigration)"
  - "UBS Vitainvest for securities-based pillar 3a investing"
search_keywords: ["tax deduction", "Steuerersparnis", "retirement savings", "Vorsorgekonto", "3a account"]
```

**Pillar 3b (Free Pension Provision)**
```yaml
service_type: retirement_planning
category: pillar_3b
product_id: pillar_3b
alias_terms: ["flexible retirement savings", "Säule 3b", "freie Vorsorge"]
features:
  - "No contribution limits or withdrawal restrictions"
  - "Investment and insurance-based solutions"
  - "Estate planning benefits"
  - "Supplementary retirement income planning"
search_keywords: ["flexible retirement", "estate planning", "Nachlassplanung", "Lebensversicherung", "supplementary income", "flexible savings", "life insurance"]
```

**Pension Planning Services** (also known as: retirement consultation, pension advice)
- Comprehensive pension analysis and gap assessment
- Tax optimization strategies
- Succession planning and inheritance considerations
- Regular portfolio reviews and adjustments

##### Investing

**Mandates**
```yaml
service_type: investment_services
category: portfolio_management
product_id: investment_mandates
alias_terms: ["investment management", "portfolio management", "Anlageverwaltung", "Vermögensverwaltung"]
features:
  - "Professional investment management with personalized strategies"
  - "Risk-appropriate asset allocation based on client profile"
  - "Regular monitoring and rebalancing"
  - "Transparent fee structure and performance reporting"
search_keywords: ["portfolio management", "asset allocation", "investment strategy", "Anlageberatung", "wealth management"]
```

**Fund Accounts**
```yaml
service_type: investment_services
category: fund_investing
product_id: fund_accounts
alias_terms: ["mutual fund investing", "collective investment schemes", "Fondskonto", "Anlagefonds"]
features:
  - "Access to wide range of UBS and third-party funds"
  - "Diversified investment options across asset classes and regions"
  - "Professional fund management with economies of scale"
  - "Regular savings plans and lump-sum investments"
search_keywords: ["mutual funds", "investment funds", "fund savings plan", "Fondssparplan", "collective investment"]
```

**Products**
```yaml
service_type: investment_services
category: investment_products
alias_terms: ["investment products", "financial instruments", "Anlageprodukte", "Finanzinstrumente"]
products:
  structured_products:
    product_id: structured_products
    description: "Capital protection and yield enhancement solutions"
    search_keywords: ["structured notes", "capital protection", "yield enhancement", "Strukturierte Produkte"]
  certificates:
    product_id: certificates
    description: "Participation in specific markets or themes"
    search_keywords: ["investment certificates", "tracker certificates", "Zertifikate", "participation rights"]
  bonds:
    product_id: bonds
    description: "Fixed income securities for stable returns"
    types: ["government bonds", "corporate bonds", "municipal bonds"]
    search_keywords: ["fixed income", "bond investing", "Obligationen", "Anleihen", "stable returns"]
  equities:
    product_id: equities
    description: "Stock investments for long-term growth"
    types: ["Swiss stocks", "international stocks", "growth stocks", "dividend stocks"]
    search_keywords: ["stock investing", "equity portfolio", "Aktien", "shares", "dividend income"]
  etfs:
    product_id: etfs
    description: "Exchange-traded funds for diversified, cost-effective investing"
    features: ["low fees", "broad diversification", "liquidity", "transparency"]
    search_keywords: ["ETF investing", "index funds", "passive investing", "cost-effective investing"]
use_cases:
  - "Building long-term wealth for retirement"
  - "Saving for children's education"
  - "Generating passive income through dividends"
  - "Diversifying investment portfolio"
  - "Hedging against inflation"
  - "Tax-efficient investing strategies"
example_scenarios:
  - scenario: "Young professional starting investment journey"
    recommendation: "ETF portfolio with 80% equities, 20% bonds"
    rationale: "Long investment horizon allows for higher risk tolerance"
  - scenario: "Pre-retirement wealth preservation"
    recommendation: "Conservative portfolio with 40% equities, 60% bonds"
    rationale: "Capital preservation becomes priority near retirement"
  - scenario: "High net worth diversification"
    recommendation: "Multi-asset portfolio including alternatives"
    rationale: "Access to sophisticated investment strategies"
```

**Gold**
```yaml
service_type: investment_services
category: precious_metals
product_id: gold_investment
alias_terms: ["precious metals", "gold investment", "Goldanlage", "Edelmetalle"]
features:
  - "Physical gold storage in UBS vaults (Swiss gold storage)"
  - "Gold certificates and ETFs"
  - "Gold savings plans for regular accumulation"
  - "Secure storage and insurance coverage"
search_keywords: ["gold bars", "gold coins", "precious metals", "safe deposit", "Goldbarren", "Goldmünzen", "Tresor"]
```

##### Keyclub

**Overview**
```yaml
service_type: loyalty_program
category: customer_rewards
product_id: keyclub
alias_terms: ["loyalty program", "rewards program", "customer benefits", "Treueprogramm", "Kundenprogramm"]
features:
  - "UBS loyalty program offering points for banking activities"
  - "Exclusive benefits and experiences for members"
  - "Tiered membership levels with increasing benefits"
search_keywords: ["loyalty rewards", "customer benefits", "exclusive offers", "Bonusprogramm", "Mitgliedschaftsvorteile"]
```

**Benefits and Rewards**
```yaml
service_type: loyalty_program
category: rewards_benefits
product_id: keyclub_benefits
features:
  - "Points earned on card spending and banking transactions"
  - "Exclusive access to events and experiences"
  - "Partner discounts and special offers"
  - "Priority customer service"
  - "Complimentary services and upgrades"
```

##### Digital Banking

**Mobile Banking**
```yaml
service_type: digital_banking
category: mobile_banking
product_id: mobile_banking_app
alias_terms: ["mobile app", "smartphone banking", "Mobile Banking App", "Banking-App"]
description: "Comprehensive mobile banking solution for iOS and Android devices"
features:
  core_functionality:
    - "Full account overview and balance checking"
    - "Transaction history and search capabilities"
    - "Money transfers and payments (domestic and international)"
    - "Bill payment and eBill management"
    - "Card management and controls"
  security_features:
    - "Biometric authentication (fingerprint, Face ID, Touch ID)"
    - "Two-factor authentication (2FA)"
    - "Device registration and management"
    - "Automatic session timeout"
    - "Fraud detection and alerts"
  payment_solutions:
    - "TWINT mobile payments and QR code scanning"
    - "Contactless payments via NFC"
    - "Peer-to-peer money transfers"
    - "QR-bill scanning and payment"
    - "Recurring payment setup"
  investment_features:
    - "Portfolio overview and performance tracking"
    - "Real-time market data and quotes"
    - "Order placement and trade execution"
    - "Investment research and analysis tools"
    - "Watchlist and price alerts"
  convenience_features:
    - "Branch and ATM locator with GPS"
    - "Appointment booking for advisory services"
    - "Document center access"
    - "Customer service chat integration"
    - "Personalized notifications and alerts"
use_cases:
  - "Daily banking on-the-go for busy professionals"
  - "Instant money transfers to family and friends"
  - "Travel payments with TWINT abroad"
  - "Investment monitoring during market hours"
  - "Emergency card blocking and replacement"
  - "Bill payment while traveling"
example_scenarios:
  - scenario: "Student splitting dinner bill"
    solution: "Use TWINT to instantly transfer share to friend"
    benefit: "No cash needed, immediate settlement"
  - scenario: "Business traveler abroad"
    solution: "Check account balance, transfer funds, pay bills remotely"
    benefit: "Full banking access regardless of location"
  - scenario: "Investor monitoring portfolio"
    solution: "Real-time portfolio tracking, place trades, set alerts"
    benefit: "Never miss market opportunities"
supported_platforms:
  - "iOS 14.0 or later"
  - "Android 8.0 (API level 26) or later"
  - "Regular updates with new features"
search_keywords: ["banking app", "mobile banking", "smartphone banking", "biometric login", "iOS app", "Android app", "TWINT payments", "mobile investing"]
```

**E-Banking**
```yaml
service_type: digital_banking
category: online_banking
product_id: e_banking
alias_terms: ["online banking", "internet banking", "web banking", "E-Banking", "Online-Banking"]
description: "Full-featured web-based banking platform accessible 24/7 from any browser"
features:
  account_management:
    - "Multi-account overview with real-time balances"
    - "Detailed transaction history with advanced filtering"
    - "Account statements and document downloads"
    - "Standing orders and direct debit management"
    - "Account alerts and notification preferences"
  payment_services:
    - "Domestic and international money transfers"
    - "Bulk payment processing for businesses"
    - "eBill management and automatic payments"
    - "QR-bill processing and payment"
    - "SEPA payments for European transactions"
  investment_platform:
    - "Comprehensive portfolio management tools"
    - "Advanced charting and technical analysis"
    - "Research reports and market commentary"
    - "Order management and trade execution"
    - "Performance reporting and analytics"
  security_infrastructure:
    - "256-bit SSL encryption for all communications"
    - "Multi-factor authentication with SMS/app tokens"
    - "Session monitoring and automatic logout"
    - "IP address verification and device recognition"
    - "Transaction signing with digital certificates"
  business_features:
    - "Multi-user access with role-based permissions"
    - "Approval workflows for large transactions"
    - "Cash management and liquidity planning tools"
    - "Integration with accounting software"
    - "Detailed reporting and export capabilities"
use_cases:
  - "Comprehensive financial management from office or home"
  - "Business banking with multiple user access"
  - "Investment research and portfolio analysis"
  - "Bulk payment processing for payroll and suppliers"
  - "Document management and record keeping"
  - "International business transactions"
example_workflows:
  - workflow: "Monthly bill payment routine"
    steps:
      - "Log in with secure authentication"
      - "Review pending eBills and invoices"
      - "Approve payments with digital signature"
      - "Schedule recurring payments for utilities"
    benefit: "Streamlined bill management with audit trail"
  - workflow: "Investment portfolio review"
    steps:
      - "Access portfolio overview and performance"
      - "Review market research and recommendations"
      - "Execute trades based on analysis"
      - "Set up price alerts for monitoring"
    benefit: "Professional-grade investment management tools"
  - workflow: "Business cash flow management"
    steps:
      - "Monitor multiple business accounts"
      - "Process supplier payments in bulk"
      - "Review cash flow projections"
      - "Transfer funds between accounts as needed"
    benefit: "Efficient treasury management for businesses"
browser_compatibility:
  - "Chrome 90+ (recommended)"
  - "Firefox 88+"
  - "Safari 14+"
  - "Edge 90+"
  - "Mobile browsers supported"
accessibility_features:
  - "Screen reader compatibility"
  - "High contrast mode"
  - "Keyboard navigation support"
  - "Adjustable font sizes"
search_keywords: ["internet banking", "web banking", "online account access", "digital banking", "browser banking", "e-banking platform", "online investment"]
```

**Services**
```yaml
service_type: digital_banking
category: digital_services
alias_terms: ["digital services", "online tools"]
services:
  digital_invoicing:
    description: "Electronic bill presentation and payment"
  document_center:
    description: "Secure storage and access to banking documents"
  notification_services:
    description: "Real-time alerts and updates"
  appointment_booking:
    description: "Online scheduling for branch visits"
  chat_support:
    description: "Digital customer service assistance"
```

**Security**
```yaml
service_type: digital_banking
category: cybersecurity
alias_terms: ["cybersecurity", "online safety", "digital protection"]
features:
  - "Multi-factor authentication and secure login procedures"
  - "Advanced encryption and fraud detection"
  - "Regular security updates and monitoring"
  - "Customer education on digital safety"
  - "Secure communication channels"
```

##### Wealth Management

**For Individuals**
```yaml
service_type: wealth_management
category: private_banking
product_id: individual_wealth_management
alias_terms: ["private banking", "personal wealth management"]
features:
  - "Personalized investment strategies and portfolio management"
  - "Comprehensive financial planning and goal setting"
  - "Tax optimization and estate planning"
  - "Access to exclusive investment opportunities"
  - "Dedicated relationship management"
```

**For Women**
```yaml
service_type: wealth_management
category: specialized_advisory
product_id: women_wealth_management
alias_terms: ["women's wealth management", "female-focused financial services"]
features:
  - "Specialized advisory services addressing women's unique financial needs"
  - "Life transition planning (career breaks, divorce, widowhood)"
  - "Investment education and confidence building"
  - "Networking opportunities and community events"
  - "Gender-lens investing options"
```

**For Entrepreneurs**
```yaml
service_type: wealth_management
category: business_wealth
product_id: entrepreneur_wealth_management
alias_terms: ["business owner wealth management", "entrepreneurial financial services"]
features:
  - "Business and personal wealth integration strategies"
  - "Succession planning and business transition support"
  - "Liquidity event planning (IPO, sale, acquisition)"
  - "Risk management and insurance solutions"
  - "Next-generation wealth transfer planning"
```

**For Financial Intermediaries**
```yaml
service_type: wealth_management
category: advisor_support
product_id: financial_intermediaries
alias_terms: ["advisor support", "intermediary services"]
features:
  - "Platform solutions for independent financial advisors"
  - "Investment research and market insights"
  - "Operational support and technology tools"
  - "Regulatory compliance assistance"
  - "Training and professional development programs"
```

### Corporate Clients

#### Founding

**Business Formation Services**
```yaml
service_type: corporate_banking
category: business_formation
product_id: business_formation_services
alias_terms: ["company incorporation", "business setup"]
features:
  - "Comprehensive support for establishing new businesses in Switzerland"
  - "Legal structure advice and registration assistance"
  - "Banking setup for new corporations and partnerships"
  - "Regulatory compliance guidance"
  - "Initial capital requirements and funding solutions"
```

#### Succession

**Business Succession Planning**
```yaml
service_type: corporate_banking
category: succession_planning
product_id: business_succession
alias_terms: ["ownership transition", "business continuity"]
features:
  - "Strategic planning for business ownership transfer"
  - "Valuation services and transaction structuring"
  - "Tax optimization for succession events"
  - "Family business transition support"
  - "Management buyout and external sale facilitation"
```

#### Accounts

**Corporate Banking Accounts**
```yaml
service_type: corporate_banking
category: business_accounts
product_id: corporate_accounts
alias_terms: ["business accounts", "commercial banking"]
features:
  - "Business current accounts in multiple currencies"
  - "Cash management and liquidity solutions"
  - "Multi-user access and authorization controls"
  - "Integration with accounting and ERP systems"
  - "Specialized accounts for different business types"
```

#### Cards

**Corporate Payment Cards**
```yaml
service_type: corporate_banking
category: business_cards
product_id: corporate_cards
alias_terms: ["business cards", "commercial cards"]
features:
  - "Corporate credit and debit cards for employees"
  - "Expense management and reporting tools"
  - "Spending controls and approval workflows"
  - "Integration with expense management systems"
  - "Rewards and cashback programs for businesses"
```

#### Payment Transactions

**Corporate Payment Solutions**
```yaml
service_type: corporate_banking
category: business_payments
product_id: corporate_payments
alias_terms: ["business payments", "commercial transactions"]
features:
  - "Bulk payment processing and file uploads"
  - "Automated clearing house (ACH) services"
  - "International wire transfer capabilities"
  - "Supply chain financing and trade finance"
  - "Treasury management solutions"
```

#### Mortgages

**Commercial Real Estate Financing**
```yaml
service_type: corporate_banking
category: commercial_mortgages
product_id: commercial_real_estate
alias_terms: ["business property loans", "commercial mortgages"]
features:
  - "Office, retail, and industrial property financing"
  - "Investment property loans for businesses"
  - "Construction and development financing"
  - "Refinancing and restructuring services"
  - "Portfolio financing for real estate investors"
```

#### Financing

**Business Financing Solutions**
```yaml
service_type: corporate_banking
category: business_financing
product_id: business_loans
alias_terms: ["commercial loans", "business credit"]
features:
  - "Working capital lines of credit"
  - "Equipment financing and leasing"
  - "Trade finance and letters of credit"
  - "Project financing for large initiatives"
  - "Acquisition and expansion financing"
```

#### Investing

**Corporate Investment Services**
```yaml
service_type: corporate_banking
category: corporate_treasury
product_id: corporate_investments
alias_terms: ["business investing", "corporate treasury"]
features:
  - "Cash management and short-term investments"
  - "Corporate bond and equity portfolios"
  - "Foreign exchange hedging strategies"
  - "Pension fund management for employees"
  - "ESG and sustainable investment options"
```

### Asset Management

#### In Switzerland

**Swiss Asset Management Services**
```yaml
service_type: asset_management
category: swiss_services
product_id: swiss_asset_management
alias_terms: ["investment management", "portfolio services"]
features:
  - "Local expertise in Swiss market conditions and regulations"
  - "CHF-denominated investment solutions"
  - "Swiss equity and bond strategies"
  - "Real estate and alternative investments"
  - "Regulatory compliance with Swiss financial laws"
```

#### Funds and Prices

**Investment Funds**
```yaml
service_type: asset_management
category: investment_funds
product_id: ubs_funds
alias_terms: ["mutual funds", "collective investment schemes"]
features:
  - "Comprehensive range of UBS-managed funds"
  - "Daily pricing and net asset value calculations"
  - "Performance tracking and historical data"
  - "Fund fact sheets and detailed documentation"
  - "Regular reporting and transparency"
```

**Wide and Diversified ETF Offering**
```yaml
service_type: asset_management
category: etf_products
product_id: ubs_etfs
alias_terms: ["exchange-traded funds", "index funds"]
features:
  - "Access to over 370 ETFs across multiple asset classes"
  - "Coverage: equities, bonds, commodities, currencies, real estate, ESG/sustainable strategies"
  - "Versatile, liquid, transparent vehicles for Swiss investors"
  - "Competitive pricing and low expense ratios"
```

**Strong Market Scale and Regional Leadership**
```yaml
service_type: asset_management
category: market_position
product_id: etf_leadership
key_metrics:
  - "USD 874 billion in index ETF AUM by mid‑2024"
  - "Leading European-based index manager"
  - "Fifth-largest ETF provider in Europe"
  - "Established market presence and institutional recognition"
```

**Distinct Core and Active ETF Lines**
```yaml
service_type: asset_management
category: etf_strategies
product_lines:
  core_etfs:
    description: "Competitively priced, high-quality building blocks"
  active_etfs:
    description: "Combine active management strategies with ETF efficiency"
features:
  - "Initial focus on fixed income solutions, expanding across asset classes"
  - "Innovation in ETF structure and methodology"
```

**Dedicated Coverage and Leadership**
```yaml
service_type: asset_management
category: leadership
key_personnel:
  - name: "Amanda Rebello"
    role: "ETF and index fund sales division leader"
    background: "DWS and BlackRock's iShares"
strategic_focus:
  - "Strategic push to accelerate ETF growth globally"
  - "AUM over $135 billion as of mid‑2025"
```

**Tailored Access via Local Pricing, Documentation, and Regulatory Compliance**
```yaml
service_type: asset_management
category: local_services
features:
  - "Swiss platform with detailed local offering"
  - "Local pricing, prospectuses, KIID documentation"
  - "Liquid share classes suitable for Swiss investors"
  - "Gradual integration of legacy Credit Suisse ETF products into UBS lineup"
```

#### Capabilities

**Comprehensive Investment Coverage Across All Major Asset Classes**
```yaml
service_type: asset_management
category: investment_capabilities
product_id: comprehensive_coverage
description: "Full spectrum investment solutions covering traditional and alternative asset classes"
coverage_areas:
  equities:
    - "Active equity strategies with fundamental research"
    - "Passive index tracking and smart beta solutions"
    - "Regional focus: Swiss, European, US, Emerging Markets"
    - "Sector and thematic equity strategies"
    - "Small, mid, and large-cap coverage"
  fixed_income:
    - "Government and corporate bond strategies"
    - "High yield and investment grade credit"
    - "Emerging market debt solutions"
    - "Duration and credit risk management"
    - "Currency hedged and unhedged options"
  multi_asset:
    - "Balanced portfolios with dynamic allocation"
    - "Target date and lifecycle strategies"
    - "Risk-based portfolio construction"
    - "Outcome-oriented solutions"
    - "Tactical asset allocation overlays"
  liquidity_management:
    - "Money market funds and cash equivalents"
    - "Short-term investment grade solutions"
    - "Treasury and government bill strategies"
    - "Enhanced cash management tools"
  etf_solutions:
    - "Over 370 ETFs across asset classes"
    - "Core building blocks for portfolio construction"
    - "Thematic and sector-specific exposure"
    - "ESG and sustainable investment options"
    - "Currency and commodity exposure"
  alternatives:
    - "Private credit and direct lending"
    - "Real estate and infrastructure investments"
    - "Private equity and venture capital"
    - "Hedge fund strategies and liquid alternatives"
    - "Commodities and natural resources"
client_segments:
  - "Institutional investors (pension funds, insurance companies)"
  - "Wealth management clients (UHNW, HNW)"
  - "Financial intermediaries and advisors"
  - "Corporate treasury departments"
  - "Sovereign wealth funds and central banks"
use_cases:
  - "Pension fund liability matching with long-duration bonds"
  - "Wealth preservation through diversified multi-asset portfolios"
  - "ESG integration for sustainable investment mandates"
  - "Alternative investments for yield enhancement"
  - "Currency hedging for international exposure"
example_solutions:
  - client_type: "Swiss pension fund"
    solution: "CHF-hedged global equity portfolio with ESG overlay"
    benefit: "Local currency exposure with global diversification"
  - client_type: "High net worth family"
    solution: "Multi-generational wealth strategy with alternatives"
    benefit: "Long-term wealth preservation and growth"
  - client_type: "Corporate treasury"
    solution: "Short-term liquidity management with enhanced yield"
    benefit: "Capital preservation with income generation"
search_keywords: ["asset management", "investment solutions", "portfolio management", "institutional investing", "wealth management"]
```

**Robust Sustainable Investing Platform**
```yaml
service_type: asset_management
category: sustainable_investing
product_id: esg_platform
alias_terms: ["ESG investing", "impact investing", "sustainable finance", "responsible investing"]
description: "Comprehensive sustainable investment platform integrating environmental, social, and governance factors"
features:
  esg_integration:
    - "ESG-integrated strategies across all major asset classes"
    - "Proprietary ESG research and scoring methodologies"
    - "Climate risk assessment and carbon footprint analysis"
    - "Engagement and proxy voting on ESG issues"
    - "ESG performance monitoring and reporting"
  impact_investing:
    - "Measurable positive environmental and social outcomes"
    - "UN Sustainable Development Goals (SDG) alignment"
    - "Impact measurement and reporting frameworks"
    - "Thematic impact strategies (clean energy, healthcare, education)"
    - "Blended finance and development finance solutions"
  product_range:
    - "Active ESG equity and fixed income strategies"
    - "Passive ESG and climate-focused ETFs"
    - "Green, social, and sustainability bonds"
    - "ESG-screened multi-asset portfolios"
    - "Alternative investments with ESG focus"
  research_capabilities:
    - "In-house ESG research team and analysts"
    - "Climate scenario analysis and stress testing"
    - "Biodiversity and nature-based solutions research"
    - "Social impact assessment methodologies"
    - "Regulatory and policy analysis"
investment_approaches:
  - approach: "ESG Integration"
    description: "Systematic incorporation of ESG factors into investment analysis"
    application: "All traditional investment strategies"
  - approach: "Best-in-Class"
    description: "Selecting companies with superior ESG performance within sectors"
    application: "Sector-neutral ESG portfolios"
  - approach: "Thematic Investing"
    description: "Focus on specific sustainability themes and trends"
    application: "Clean energy, water, circular economy strategies"
  - approach: "Impact Investing"
    description: "Intentional positive impact alongside financial returns"
    application: "Social infrastructure, microfinance, green bonds"
  - approach: "Exclusionary Screening"
    description: "Avoiding investments in harmful industries or practices"
    application: "Tobacco, weapons, fossil fuel exclusions"
use_cases:
  - "Pension funds meeting fiduciary duty and ESG mandates"
  - "Insurance companies managing climate-related risks"
  - "Family offices aligning investments with values"
  - "Sovereign wealth funds implementing national sustainability goals"
  - "Corporate treasuries supporting ESG corporate strategies"
example_solutions:
  - client_type: "European pension fund"
    solution: "Climate-aligned equity portfolio with 1.5°C pathway"
    impact: "50% reduction in carbon intensity vs benchmark"
    benefit: "Climate risk mitigation with competitive returns"
  - client_type: "Impact-focused foundation"
    solution: "SDG-aligned multi-asset portfolio with impact measurement"
    impact: "Direct contribution to education and healthcare access"
    benefit: "Measurable social outcomes with financial sustainability"
  - client_type: "Sustainable-focused UHNW family"
    solution: "Next-generation ESG strategy with engagement overlay"
    impact: "Active ownership driving corporate ESG improvements"
    benefit: "Values alignment with long-term wealth preservation"
regulatory_compliance:
  - "EU Sustainable Finance Disclosure Regulation (SFDR)"
  - "EU Taxonomy Regulation alignment"
  - "Swiss Climate Scores implementation"
  - "Task Force on Climate-related Financial Disclosures (TCFD)"
  - "Principles for Responsible Investment (PRI) signatory"
search_keywords: ["ESG investing", "sustainable finance", "impact investing", "climate investing", "responsible investing", "green bonds", "SDG alignment"]
```

**White-labelling and Fund Management Company (ManCo) Services**
```yaml
service_type: asset_management
category: fund_services
product_id: manco_services
alias_terms: ["fund management services", "ManCo services", "white-label solutions", "fund administration"]
description: "Comprehensive fund management company services providing regulatory, operational, and governance support across multiple jurisdictions"
jurisdictions:
  switzerland:
    entity: "UBS Fund Management (Switzerland) AG"
    market_position: "Over 25% market share in Swiss ManCo services"
    specialties: ["Swiss fund regulations", "FINMA compliance", "local market expertise"]
    fund_types: ["Swiss investment funds", "SICAV", "contractual funds", "limited partnerships"]
  luxembourg:
    entity: "MultiConcept Fund Management S.A."
    specialties: ["UCITS funds", "alternative investment funds", "cross-border distribution"]
    fund_types: ["SICAV", "SICAF", "SIF", "RAIF", "Part II funds"]
  ireland:
    specialties: ["UCITS expertise", "AIFMD compliance", "European passporting"]
    fund_types: ["ICAV", "unit trusts", "investment limited partnerships"]
core_services:
  governance_and_compliance:
    description: "Comprehensive regulatory oversight and governance framework"
    features:
      - "Board of directors and management company services"
      - "Regulatory reporting and compliance monitoring"
      - "Anti-money laundering (AML) and know-your-customer (KYC) procedures"
      - "Ongoing regulatory change management"
      - "Audit coordination and regulatory examinations"
    use_cases:
      - "Asset managers seeking regulatory expertise without in-house infrastructure"
      - "International managers entering European markets"
      - "Boutique firms requiring institutional-grade compliance"
  risk_management:
    description: "Institutional-quality risk oversight for third-party and bespoke funds"
    features:
      - "Independent risk monitoring and reporting"
      - "Liquidity risk management"
      - "Counterparty and operational risk assessment"
      - "Stress testing and scenario analysis"
      - "Risk committee and governance oversight"
    capabilities:
      - "Real-time portfolio monitoring"
      - "Regulatory risk limit compliance"
      - "ESG risk integration"
      - "Alternative investment risk frameworks"
  operational_support:
    description: "End-to-end operational infrastructure for fund management"
    features:
      - "Fund accounting and valuation services"
      - "Transfer agency and shareholder services"
      - "Distribution support and marketing coordination"
      - "Tax reporting and withholding services"
      - "Corporate actions processing"
white_label_solutions:
  description: "Customized fund solutions under client branding"
  features:
    - "Client-branded fund structures"
    - "Tailored investment strategies"
    - "Custom reporting and communication"
    - "Dedicated relationship management"
    - "Flexible fee structures"
  target_clients:
    - "Independent asset managers"
    - "Family offices and private banks"
    - "Insurance companies and pension funds"
    - "Fintech and robo-advisor platforms"
    - "Corporate treasury departments"
use_cases:
  - client_type: "US asset manager"
    need: "European fund launch for institutional clients"
    solution: "Luxembourg SICAV with UCITS passport"
    benefit: "Pan-European distribution with regulatory compliance"
  - client_type: "Swiss family office"
    need: "Private fund structure for multi-generational wealth"
    solution: "Swiss limited partnership with governance overlay"
    benefit: "Tax-efficient structure with professional oversight"
  - client_type: "Pension fund"
    need: "Segregated mandate with institutional governance"
    solution: "Dedicated fund vehicle with independent risk monitoring"
    benefit: "Fiduciary-grade oversight with operational efficiency"
example_scenarios:
  - "Boutique equity manager launches European fund using UBS Luxembourg ManCo, accessing 27 EU markets"
  - "Family office creates private fund structure in Switzerland, benefiting from UBS governance and compliance expertise"
  - "Insurance company establishes segregated account with independent risk oversight and regulatory reporting"
competitive_advantages:
  - "Market-leading position in Swiss ManCo services (25%+ market share)"
  - "Multi-jurisdictional expertise across key European fund domiciles"
  - "Institutional-grade risk management and governance frameworks"
  - "Scalable technology platform supporting diverse fund structures"
  - "Deep regulatory expertise and proactive compliance management"
search_keywords: ["fund management company", "ManCo services", "white-label funds", "fund administration", "regulatory compliance", "UCITS", "alternative funds"]
```

**Unified Global Alternatives Platform**
```yaml
service_type: asset_management
category: alternatives
product_id: global_alternatives
alias_terms: ["alternative investments", "private markets", "hedge funds", "alternative strategies"]
description: "Comprehensive global platform consolidating alternative investments under unified governance, sourcing, and risk management framework"
platform_structure:
  consolidation_benefits:
    - "Single point of access for diverse alternative strategies"
    - "Unified due diligence and risk management processes"
    - "Streamlined reporting and portfolio monitoring"
    - "Economies of scale in manager selection and negotiation"
    - "Consistent governance and operational standards"
  manager_universe:
    ubs_strategies:
      description: "Proprietary UBS alternative investment strategies"
      advantages: ["Direct access", "aligned interests", "transparent reporting", "integrated risk management"]
    third_party_managers:
      description: "Carefully selected external alternative investment managers"
      selection_criteria: ["track record", "investment process", "risk management", "operational excellence", "ESG integration"]
alternative_asset_classes:
  private_credit:
    description: "Direct lending and credit strategies across the risk spectrum"
    strategies:
      - "Direct lending to mid-market companies"
      - "Distressed and special situations credit"
      - "Asset-based lending and structured credit"
      - "Mezzanine and subordinated debt"
      - "Real estate debt and commercial mortgages"
    target_returns: "Mid-to-high single digit to low double-digit returns"
    use_cases:
      - "Yield enhancement in low interest rate environments"
      - "Portfolio diversification beyond traditional fixed income"
      - "Inflation protection through floating rate structures"
  infrastructure:
    description: "Long-term investments in essential infrastructure assets"
    sectors:
      - "Transportation (airports, ports, toll roads, railways)"
      - "Energy infrastructure (renewables, transmission, storage)"
      - "Utilities (water, waste management, gas distribution)"
      - "Digital infrastructure (data centers, fiber networks, towers)"
      - "Social infrastructure (hospitals, schools, housing)"
    characteristics: ["stable cash flows", "inflation protection", "long-term contracts", "essential services"]
    use_cases:
      - "Pension fund liability matching with long-duration assets"
      - "ESG-focused investing through renewable energy projects"
      - "Inflation hedging through regulated utility investments"
  private_equity:
    description: "Equity investments in private companies across lifecycle stages"
    strategies:
      - "Buyout funds targeting mature companies"
      - "Growth capital for expanding businesses"
      - "Venture capital for early-stage companies"
      - "Secondary market transactions"
      - "Co-investment opportunities alongside fund managers"
    geographic_focus: ["North America", "Europe", "Asia-Pacific", "Emerging markets"]
    use_cases:
      - "Long-term capital appreciation through company transformation"
      - "Access to innovation and disruptive technologies"
      - "Diversification beyond public market exposure"
  hedge_funds:
    description: "Liquid alternative strategies with diverse risk-return profiles"
    strategies:
      - "Long/short equity and sector-focused strategies"
      - "Event-driven and merger arbitrage"
      - "Global macro and currency strategies"
      - "Relative value and fixed income arbitrage"
      - "Multi-strategy and fund-of-funds approaches"
    risk_profiles: ["low volatility absolute return", "market neutral", "directional strategies", "opportunistic"]
    use_cases:
      - "Portfolio diversification and risk reduction"
      - "Absolute return generation in volatile markets"
      - "Tactical allocation for market opportunities"
sourcing_and_diligence:
  manager_selection:
    process_steps:
      - "Global manager universe screening and identification"
      - "Quantitative performance and risk analysis"
      - "Qualitative assessment of investment process and team"
      - "Operational due diligence and risk evaluation"
      - "ESG integration and impact assessment"
      - "Legal and regulatory compliance review"
    evaluation_criteria:
      - "Consistent risk-adjusted performance track record"
      - "Experienced and stable investment team"
      - "Robust investment process and risk management"
      - "Strong operational infrastructure and controls"
      - "Alignment of interests through co-investment"
  ongoing_monitoring:
    - "Regular performance and risk reporting"
    - "Quarterly manager meetings and site visits"
    - "Portfolio construction and allocation monitoring"
    - "Liquidity and redemption management"
    - "ESG and impact measurement tracking"
client_access_models:
  direct_investments:
    description: "Direct access to individual alternative strategies"
    minimum_investments: "Varies by strategy (typically USD 1-10 million)"
    target_clients: ["institutional investors", "ultra-high net worth individuals", "family offices"]
  fund_of_funds:
    description: "Diversified portfolios of alternative investments"
    benefits: ["professional manager selection", "diversification", "lower minimums", "ongoing monitoring"]
    target_clients: ["smaller institutions", "high net worth individuals", "advisory clients"]
  co_investment_opportunities:
    description: "Direct investment alongside fund managers in specific deals"
    advantages: ["reduced fees", "increased allocation", "direct deal exposure", "enhanced returns"]
use_cases:
  - client_type: "Pension fund"
    objective: "Diversify beyond traditional assets with inflation protection"
    solution: "Infrastructure and real estate debt allocation (15-20% of portfolio)"
    benefit: "Stable cash flows with inflation linkage and liability matching"
  - client_type: "Insurance company"
    objective: "Enhance yield while managing duration and credit risk"
    solution: "Private credit allocation with floating rate exposure"
    benefit: "Higher yields than public credit with reduced interest rate sensitivity"
  - client_type: "Family office"
    objective: "Long-term wealth growth with portfolio diversification"
    solution: "Multi-strategy alternatives program (private equity, hedge funds, real assets)"
    benefit: "Enhanced returns with reduced correlation to public markets"
example_scenarios:
  - "European pension fund allocates 20% to alternatives: 8% private equity, 7% infrastructure, 5% private credit"
  - "US endowment implements alternatives program targeting 30% allocation across multiple strategies"
  - "Swiss family office creates alternatives portfolio with focus on sustainable infrastructure and impact investing"
risk_management:
  - "Comprehensive due diligence and ongoing monitoring processes"
  - "Portfolio-level risk assessment and stress testing"
  - "Liquidity management and redemption planning"
  - "Operational risk evaluation and mitigation"
  - "ESG risk integration and impact measurement"
search_keywords: ["alternative investments", "private equity", "hedge funds", "infrastructure", "private credit", "real assets", "illiquid investments"]
```

**Tailored Multi-asset and Advisory Solutions**
```yaml
service_type: asset_management
category: advisory_solutions
product_id: multi_asset_solutions
features:
  - "Client-specific multi-asset strategies"
  - "Balanced, growth, income, total return, and unconstrained mandates"
  - "UBS Partner technology platform for scalable advisory operations"
  - "Automated portfolio analysis and regulatory alignment"
  - "Customized investment solutions"
```

#### Insights

**Deep, Cross‑Asset Expert Content Under "The Red Thread" Brand**
```yaml
service_type: asset_management
category: research_insights
product_id: red_thread_content
features:
  - "Original articles, videos, and opinion pieces"
  - "Series: The Red Thread, Bond Bites, Macro Monthly, PM Corner, TRTPM (Private Markets)"
  - "Forward‑looking perspectives across asset classes and themes"
  - "Expert commentary and market analysis"
```

**Thematic Views Covering Priority Topics**
```yaml
service_type: asset_management
category: thematic_research
strategic_themes:
  - "China & Emerging Markets"
  - "Sustainable & Impact Investing"
  - "Alternatives"
  - "Global Sovereign Markets"
features:
  - "Macro trend exploration and investment implications"
  - "Sector-specific insights and analysis"
  - "Regional market perspectives"
```

**Timely Analysis on Fixed Income, Real Estate, and Private Markets**
```yaml
service_type: asset_management
category: market_analysis
key_reports:
  - "Navigating Fixed Income in 2025: Key Trends and Insights"
  - "Soaring to New Heights - private real estate opportunities"
features:
  - "Rate divergence and AI adoption analysis"
  - "Unified Global Alternatives (UGA) framework insights"
  - "USD 295 billion AUM coverage"
```

**Original Insights from Events**
```yaml
service_type: asset_management
category: event_insights
features:
  - "Firsthand commentary from high‑level events"
  - "Eight reflections from Greater China Conference"
  - "Macro insights from clients, central banks, sovereign wealth perspectives"
  - "Event-driven market analysis"
```

**Multi-format Delivery Designed for Diverse User Preferences**
```yaml
service_type: asset_management
category: content_delivery
features:
  - "Content across articles and videos"
  - "Series hubs and theme navigation"
  - "Depth and accessibility for institutional, advisory, and academic audiences"
  - "Multiple consumption formats and channels"
```

#### About Us

**Craftsmanship, Trust, and Client-centricity as Core Philosophy**
```yaml
service_type: asset_management
category: company_philosophy
leadership:
  - "Aleksandar Ivanovic, President of UBS Asset Management"
features:
  - "Deeply client-focused approach driven by investment craftsmanship"
  - "Global expertise and local market knowledge"
  - "Mission: Understanding client needs and being a trusted partner through all market cycles"
```

**Integrated Platform Across All Major Asset Classes and Strategies**
```yaml
service_type: asset_management
category: platform_capabilities
features:
  - "Scalable, diversified capabilities"
  - "Active and index-based equities, fixed income, multi-asset strategies"
  - "Liquidity solutions, ETFs, and alternatives"
  - "Private credit, real estate, infrastructure, private equity, hedge funds"
```

**Global Presence with Strong Swiss Roots**
```yaml
service_type: asset_management
category: global_presence
operations:
  - "Operations in approximately 24 countries"
  - "Anchored in Switzerland with global reach"
features:
  - "Service to institutional, wholesale intermediary, and wealth management clients"
  - "Broad and localized solution capabilities"
```

**Turnkey Infrastructure and Advisory Support for Intermediaries**
```yaml
service_type: asset_management
category: infrastructure_services
features:
  - "Platform solutions for third-party managers and institutional clients"
  - "Advisory services and fund administration"
  - "Fund Management Company (ManCo) services in Switzerland, Luxembourg, and Ireland"
  - "Operational and regulatory support"
```

**Long-standing Leadership in Alternatives and Real Assets**
```yaml
service_type: asset_management
category: alternatives_leadership
key_metrics:
  - "Over 85 years of experience in real estate investing"
  - "One of the largest real estate and private markets managers globally"
features:
  - "Broad alternatives platform with internal and third-party strategies"
  - "Unified alternatives capability with rigorous research and risk frameworks"
```

### Investment Bank

#### What We Offer

**Comprehensive Suite of Financial Solutions**
```yaml
service_type: investment_bank
category: financial_solutions
product_id: comprehensive_suite
features:
  - "Global capital markets access"
  - "Deep M&A advisory services"
  - "Bespoke financing solutions"
  - "Equity and debt capital markets execution"
  - "Tailored solutions for corporate, institutional, and wealth-management needs"
search_keywords:
  - "capital markets"
  - "M&A advisory"
  - "financing solutions"
  - "equity markets"
  - "debt markets"
```

**Strong ESG & Sustainable Finance Capabilities**
```yaml
service_type: investment_bank
category: sustainable_finance
product_id: esg_capabilities
alias_terms:
  - "green finance"
  - "sustainable banking"
features:
  - "ESG research and analysis"
  - "Green and sustainable bond advisory and issuance"
  - "Thematic investing solutions"
  - "Carbon market innovations (e.g., Carbonplace pilot transactions)"
  - "Climate finance and transition funding"
search_keywords:
  - "ESG"
  - "sustainable finance"
  - "green bonds"
  - "carbon markets"
  - "climate finance"
```

**Global Networks and High‑Touch Access**
```yaml
service_type: investment_bank
category: network_access
features:
  - "Extended global network and relationships"
  - "Curated investor conferences and industry events"
  - "Bespoke roadshows connecting companies with global investors"
  - "Policy‑maker engagement and government relations"
  - "Cross-border transaction facilitation"
search_keywords:
  - "global network"
  - "investor conferences"
  - "roadshows"
  - "cross-border transactions"
```

**Advanced Trading & Liquidity Platform via UBS Neo**
```yaml
service_type: investment_bank
category: trading_platform
product_id: ubs_neo
features:
  - "Seamless, multi-asset trading access"
  - "Institutional-grade liquidity and execution capabilities"
  - "Integration with research insights and market data"
  - "Ideal for institutional and portfolio manager clients"
  - "Real-time market access and analytics"
search_keywords:
  - "UBS Neo"
  - "trading platform"
  - "liquidity"
  - "execution"
  - "market data"
```

**Thought Leadership Backed by Robust Research**
```yaml
service_type: investment_bank
category: research_leadership
features:
  - "UBS Global Research team support"
  - "Macro, sector, and company analysis"
  - "Data-driven insights and market intelligence"
  - "ESG coverage and sustainable finance research"
  - "Decision support across markets and industries"
search_keywords:
  - "research"
  - "market intelligence"
  - "macro analysis"
  - "ESG research"
```

#### About Us

**Two Main Divisions: Global Banking and Global Markets**
```yaml
service_type: investment_bank
category: organizational_structure
divisions:
  global_banking:
    - "M&A, capital raising, and advisory services"
  global_markets:
    - "Trading, liquidity, and risk management solutions across asset classes"
features:
  - "Integrated approach to client service and solution delivery"
  - "Cross-divisional collaboration and expertise sharing"
```

**Integrated Research and Operations Functions**
```yaml
service_type: investment_bank
category: support_functions
features:
  - "Investment Bank Research: Macroeconomic, sector-specific, and ESG insights"
  - "Operations teams: Seamless post-trade processing and transaction support"
  - "Technology infrastructure and digital capabilities"
  - "Risk management and compliance oversight"
```

**Broad Client Base with Tailored Execution**
```yaml
service_type: investment_bank
category: client_base
client_types:
  - "Institutional investors"
  - "Corporate clients"
  - "Wealth managers"
features:
  - "Bespoke solutions combining global reach and advisory expertise"
  - "Digital execution infrastructure and traditional relationship management"
  - "Sector specialization and industry expertise"
```

**Specialized Team for Private Capital Markets**
```yaml
service_type: investment_bank
category: private_capital
team: "Private Financing Markets group"
features:
  - "Originating, structuring, and distributing private capital deals"
  - "Cross-industry and regional coverage"
  - "Connecting issuers and investors outside of public markets"
  - "Alternative funding solutions"
```

**Award-winning Execution and Innovation Culture**
```yaml
service_type: investment_bank
category: awards_recognition
awards:
  - "Global Finance's 'World's Best Investment Bank' recognition"
  - "Multiple Risk and Euromoney awards for derivatives and FX excellence"
features:
  - "Precision, client-centricity, and innovation emphasis"
  - "Industry leadership and competitive positioning"
```

#### In Focus

**Comprehensive Insights Platform Led by Award‑Winning Research**
```yaml
service_type: investment_bank
category: research_platform
features:
  - "High-level commentary and analysis from Global Research team"
  - "Market insights and macroeconomic forecasts"
  - "Thematic deep-dives for informed decision-making"
  - "Regular publications and research updates"
```

**Advanced Data and Analytics Capabilities**
```yaml
service_type: investment_bank
category: analytics_tools
tools:
  ubs_evidence_lab:
    - "Alternative datasets and market intelligence"
  holt:
    - "Equity scoring and valuation analytics"
  quant_answers:
    - "Quantitative research and risk analytics"
  ubs_delta:
    - "Portfolio performance analysis and attribution"
features:
  - "Proprietary tools and analytical frameworks"
```

**Featured Thought Leadership Topics**
```yaml
service_type: investment_bank
category: thought_leadership
topics:
  future_world:
    - "Emerging trends reshaping capital markets"
  china_in_focus:
    - "Chinese market analysis and opportunities"
  esg_sustainability:
    - "Environmental and social governance insights"
  private_markets:
    - "Alternative investment analysis and trends"
features:
  - "Regular updates and strategic insights"
```

**Flagship Publications and Market Outlooks**
```yaml
service_type: investment_bank
category: publications
key_publications:
  - "Global Investment Returns Yearbook 2025: 125 years of asset performance analysis emphasizing diversification benefits"
  - "2025 Sector Outlook Report: Interest rate scenarios, earnings trends, and financial sector solvency"
features:
  - "Comprehensive market analysis and forward-looking perspectives"
  - "Historical context and future projections"
```

**Multi-format Delivery: Reports, Podcasts, Events, and Neo Access**
```yaml
service_type: investment_bank
category: content_delivery
delivery_channels:
  - "Research delivery through articles and detailed reports"
  - "Global Research Pod Hub for podcast content"
  - "Corporate events and conferences for client engagement"
  - "Full content access via UBS Neo platform"
features:
  - "Multiple channels for research consumption"
```

### About UBS

#### Our Firm

**Clear Corporate Purpose and Identity**
```yaml
service_type: corporate_information
category: company_purpose
mission:
  - "Reimagining the power of investing"
  - "Connecting people for a better world"
features:
  - "Focus on client value creation and broader societal impact"
  - "Swiss heritage with global perspective"
  - "Commitment to sustainable and responsible banking"
```

**Integrated Global Structure with Diverse Business Lines**
```yaml
service_type: corporate_information
category: business_structure
divisions:
  - "Global Wealth Management"
  - "Asset Management"
  - "Investment Bank"
  - "Personal & Corporate Banking"
features:
  - "Full-spectrum financial services platform"
  - "Cross-divisional collaboration and synergies"
  - "Comprehensive client coverage and solution delivery"
```

**Swiss Heritage with Global Reach**
```yaml
service_type: corporate_information
category: company_history
headquarters:
  - "Zurich"
  - "Basel"
history:
  - "Formed through 1998 merger of Union Bank of Switzerland and Swiss Bank Corporation"
features:
  - "Worldwide operations across major financial centers"
  - "Presence in U.S., Europe, Asia, and other key markets"
```

**Strong Corporate Governance and Transparency**
```yaml
service_type: corporate_information
category: governance
features:
  - "Dedicated corporate governance framework"
  - "Clear organizational structure and executive leadership"
  - "Annual reports and AGM transparency"
  - "Investor resources and stakeholder communication"
```

**Emphasis on Culture, Employees, and Inclusion**
```yaml
service_type: corporate_information
category: culture_inclusion
features:
  - "People and culture focus with DE&I commitments"
  - "Diversity, inclusion, and workplace values across global operations"
  - "Employee development and engagement programs"
  - "Inclusive culture and equal opportunity practices"
```

#### A Bank Like Switzerland

**Positioning UBS as a Reflection of Swiss Identity**
```yaml
service_type: corporate_information
category: brand_positioning
campaign: "A bank like Switzerland"
swiss_values:
  - "responsibility"
  - "reliability"
  - "conservatism"
features:
  - "Campaign emphasizing national pride and authenticity"
  - "Swiss heritage as competitive advantage"
  - "Local market leadership with international expertise"
```

**Commitment to Long‑Term Civic and Social Responsibility**
```yaml
service_type: corporate_information
category: social_responsibility
initiatives:
  - "UBS Kids Cup"
partnerships:
  - "SwissSkills"
  - "ETH Zurich"
features:
  - "Major supporter of Switzerland's cultural, vocational, sports, and social development"
  - "Youth empowerment through initiatives"
  - "Community investment and social impact programs"
```

**Integrated Launch Strategy with Broad Visibility**
```yaml
service_type: corporate_information
category: marketing_strategy
channels:
  - "TV"
  - "cinema"
  - "social media"
  - "digital channels"
  - "print"
features:
  - "UBS touchpoints integration (e‑banking, branches)"
  - "Cohesive messaging nationwide in three phases"
  - "Multi-channel marketing and communication approach"
```

**Personal and Aspirational Storytelling**
```yaml
service_type: corporate_information
category: storytelling
content_series:
  - "Six-part social media series sharing real individuals' hopes and aspirations"
features:
  - "Personal stories linked to national progress"
  - "Bank's role in helping future generations thrive"
  - "Emotional connection and brand authenticity"
```

**Collaboration with a Swiss Creative Agency**
```yaml
service_type: corporate_information
category: creative_partnership
agency: "Fraser (Schweiz)"
features:
  - "Creative milestone for both UBS and the agency"
  - "High-quality visual storytelling reflecting shared Swiss heritage"
  - "Local creative partnership and cultural alignment"
```

#### Commitment to Football

**Celebrating Swiss Football Talent at Home Euros**
```yaml
service_type: corporate_information
category: sports_sponsorship
sport: football
features:
  - "Support and promotion of young football talent across Switzerland"
  - "Country hosting European Championship engagement"
  - "Ongoing role as champion of national sport development"
  - "Youth development and talent identification programs"
```

**Turning Dreams into Opportunities for Girls' Football**
```yaml
service_type: corporate_information
category: girls_football_programs
programs:
  - "Doppelpass"
  - "UEFA Playmakers"
features:
  - "Expanded funding and events for girls nationwide"
  - "Football trial opportunities and early engagement pathways"
  - "Gender equality in sports promotion"
```

**The New Kickstart Toolbox**
```yaml
service_type: corporate_information
category: football_education_tools
partnership: "Swiss Football Association"
contents:
  - "25 drills"
  - "themed cards"
  - "posters"
  - "stickers"
features:
  - "Help schools and clubs introduce girls to football"
  - "Playful, inspirational approach to sport introduction"
```

**Engagement Beyond the Pitch**
```yaml
service_type: corporate_information
category: holistic_development
features:
  - "Football as driver for empowerment, opportunity, and personal development"
  - "Broader initiatives around education, inclusion, and financial literacy"
  - "Community engagement through sports"
  - "Holistic approach to youth development"
```

**Exclusive Promotion Campaign**
```yaml
service_type: corporate_information
category: promotional_campaigns
features:
  - "Microsite competition for unique branded memorabilia"
  - "XXL jersey blanket not available commercially"
  - "Fun, premium engagement and brand interaction"
  - "Exclusive customer experiences and rewards"
```

#### Cyber Security at UBS

**Robust, Multilayered Cybersecurity Framework**
```yaml
service_type: cybersecurity
category: security_framework
framework: "Cyber Risk Institute's Cyber Profile"
security_functions:
  - "govern"
  - "identify"
  - "protect"
  - "detect"
  - "respond"
  - "recover"
  - "extend"
features:
  - "Comprehensive information‑security program"
  - "Administrative, physical, and technical safeguards"
  - "Senior governance oversight with regular internal and external assessments"
```

**24/7 Global Monitoring & Rapid Incident Response**
```yaml
service_type: cybersecurity
category: monitoring_response
operations_center: "Cybersecurity Operations Center"
features:
  - "Continuous threat monitoring"
  - "Security event correlation and alert triggering"
  - "Swift response and recovery efforts for business continuity"
  - "Real-time threat detection and mitigation"
```

**Emphasis on Third‑Party / Supply‑Chain Risk**
```yaml
service_type: cybersecurity
category: supply_chain_security
alias_terms: ["vendor risk management", "third-party security", "supply chain cybersecurity", "partner risk assessment"]
description: "Comprehensive third-party risk management program ensuring security across the entire vendor ecosystem"
risk_areas:
  vendors:
    description: "Technology vendors and software providers"
    assessment_criteria: ["security certifications", "data handling practices", "incident response capabilities", "compliance standards"]
    monitoring_activities: ["continuous security assessments", "vulnerability scanning", "security questionnaires", "on-site audits"]
  service_providers:
    description: "Outsourced service providers and business partners"
    risk_factors: ["data access levels", "geographic location", "regulatory compliance", "business continuity plans"]
    mitigation_measures: ["contractual security requirements", "regular security reviews", "incident notification procedures"]
risk_management_process:
  pre_engagement:
    - "Security due diligence and risk assessment"
    - "Contractual security requirements definition"
    - "Compliance verification and certification review"
  ongoing_monitoring:
    - "Continuous security monitoring and assessment"
    - "Regular security questionnaires and audits"
    - "Threat intelligence sharing and collaboration"
  incident_response:
    - "Swift incident response coordination"
    - "Impact assessment and containment"
    - "Client communication and regulatory reporting"
use_cases:
  - "Cloud service provider security assessment"
  - "Software vendor vulnerability management"
  - "Outsourced IT service provider monitoring"
  - "Payment processor security compliance"
example_scenarios:
  - "Technology vendor experiences data breach, UBS activates incident response protocol within 2 hours"
  - "Cloud provider implements new security controls, UBS conducts assessment to verify compliance"
  - "Payment processor reports vulnerability, UBS coordinates patch management and testing"
reference_incident:
  incident: "June 2025 Chain IQ supply‑chain breach affecting UBS"
  impact: "No client data exposed"
  response: "Swift containment and assessment, demonstrating effective third-party incident response"
  lessons_learned: "Enhanced vendor monitoring and incident notification procedures"
search_keywords: ["vendor risk", "supply chain security", "third-party assessment", "partner security", "vendor management"]
```

**Awareness of Evolving Threat Types**
```yaml
service_type: cybersecurity
category: threat_awareness
alias_terms: ["cyber threats", "security threats", "threat intelligence", "cybersecurity awareness"]
description: "Comprehensive threat awareness program addressing emerging and evolving cybersecurity threats"
threat_types:
  phishing:
    description: "Fraudulent attempts to obtain sensitive information via deceptive communications"
    variants: ["email phishing", "SMS phishing (smishing)", "voice phishing (vishing)", "social media phishing"]
    detection_indicators: ["urgent language", "suspicious sender", "unexpected attachments", "request for credentials"]
    prevention_measures: ["email filtering", "user training", "multi-factor authentication", "verification procedures"]
  deepfakes:
    description: "AI-generated synthetic media used for impersonation and fraud"
    types: ["voice deepfakes", "video deepfakes", "image manipulation", "executive impersonation"]
    detection_guidance:
      - "Unnatural blinking patterns in video calls"
      - "Robotic or inconsistent audio quality"
      - "Facial inconsistencies and artifacts"
      - "Unusual speech patterns or mannerisms"
    use_cases:
      - "CEO fraud and executive impersonation"
      - "Social engineering attacks"
      - "Investment fraud schemes"
      - "Identity theft and account takeover"
  ransomware:
    description: "Malicious software that encrypts data and demands payment for decryption"
    attack_vectors: ["email attachments", "malicious websites", "USB devices", "network vulnerabilities"]
    prevention_strategies: ["regular backups", "patch management", "network segmentation", "endpoint protection"]
    response_procedures: ["isolation and containment", "backup restoration", "law enforcement coordination"]
  whaling_attacks:
    description: "Targeted phishing attacks specifically aimed at senior executives and high-value individuals"
    characteristics: ["highly personalized content", "executive-level targeting", "business context awareness"]
    protection_measures: ["executive security training", "verification protocols", "communication procedures"]
awareness_programs:
  employee_training:
    - "Regular cybersecurity awareness sessions"
    - "Simulated phishing exercises"
    - "Threat landscape updates"
    - "Incident reporting procedures"
  executive_briefings:
    - "C-level threat intelligence briefings"
    - "Industry-specific threat analysis"
    - "Regulatory and compliance updates"
    - "Strategic security planning"
use_cases:
  - "Employee receives suspicious email, reports to security team for analysis"
  - "Executive targeted by whaling attack, follows verification protocol to prevent fraud"
  - "Deepfake voice call detected, incident response team investigates and alerts stakeholders"
  - "Ransomware attempt blocked by endpoint protection, security team conducts forensic analysis"
example_scenarios:
  - "Employee receives urgent email claiming to be from CEO requesting wire transfer, follows verification protocol and discovers it's a whaling attack"
  - "Video call with apparent senior executive requesting sensitive information, participant notices unnatural blinking and reports potential deepfake"
  - "Suspicious email attachment triggers security alert, automated systems quarantine message and notify security team"
search_keywords: ["phishing awareness", "deepfake detection", "ransomware protection", "whaling attacks", "cyber threats", "security training"]
```

**Guidance for Individuals and Companies on Proactive Hygiene**
```yaml
service_type: cybersecurity
category: security_best_practices
alias_terms: ["cybersecurity hygiene", "security best practices", "cyber safety", "digital security"]
description: "Comprehensive cybersecurity hygiene guidelines for individuals and organizations to maintain strong security posture"
best_practices:
  verification_and_skepticism:
    principle: "Always question unsolicited requests"
    guidelines:
      - "Verify identity through independent communication channels"
      - "Question urgent or unusual requests for information or money"
      - "Confirm requests through official company procedures"
      - "Be skeptical of unexpected opportunities or threats"
    use_cases:
      - "Verifying wire transfer requests through phone call"
      - "Confirming executive requests through official channels"
      - "Validating investment opportunities with compliance team"
  safe_browsing_and_email:
    principle: "Avoid clicking unknown links or attachments"
    guidelines:
      - "Hover over links to preview destinations"
      - "Scan attachments with antivirus software"
      - "Use official websites instead of email links"
      - "Report suspicious emails to security team"
    protective_measures:
      - "Email filtering and spam protection"
      - "Web content filtering"
      - "Attachment sandboxing"
      - "URL reputation checking"
  authentication_and_passwords:
    principle: "Use strong, unique passwords and enable multi-factor authentication"
    password_requirements:
      - "Minimum 12 characters with complexity"
      - "Unique passwords for each account"
      - "Regular password updates"
      - "Password manager utilization"
    multi_factor_authentication:
      - "SMS-based verification"
      - "Authenticator app tokens"
      - "Hardware security keys"
      - "Biometric authentication"
  network_security:
    principle: "Secure networks and avoid public Wi-Fi for sensitive activities"
    home_network_security:
      - "Router configuration with WPA3 encryption"
      - "Regular firmware updates"
      - "Guest network separation"
      - "Strong administrative passwords"
    public_network_precautions:
      - "VPN usage for sensitive communications"
      - "Avoid banking and financial transactions"
      - "Disable auto-connect features"
      - "Use mobile hotspot when possible"
  data_protection:
    principle: "Regular data backups and secure storage"
    backup_strategies:
      - "3-2-1 backup rule (3 copies, 2 different media, 1 offsite)"
      - "Automated backup scheduling"
      - "Backup integrity testing"
      - "Encrypted backup storage"
    data_classification:
      - "Identify sensitive information"
      - "Apply appropriate protection levels"
      - "Secure disposal procedures"
      - "Access control implementation"
  social_media_awareness:
    principle: "Control social media sharing and privacy settings"
    privacy_guidelines:
      - "Review and adjust privacy settings regularly"
      - "Limit personal information sharing"
      - "Be cautious with location sharing"
      - "Avoid posting financial or work-related information"
    professional_considerations:
      - "Separate personal and professional accounts"
      - "Follow company social media policies"
      - "Be aware of social engineering risks"
  crisis_response:
    principle: "Verify sources before donating or responding to emergency requests"
    verification_steps:
      - "Research organizations through official channels"
      - "Verify emergency situations through multiple sources"
      - "Use established charitable organizations"
      - "Be wary of high-pressure tactics"
target_audiences:
  individuals:
    - "Personal banking customers"
    - "Wealth management clients"
    - "General public education"
  small_businesses:
    - "Corporate banking clients"
    - "Small and medium enterprises"
    - "Professional service firms"
  large_organizations:
    - "Enterprise clients"
    - "Financial institutions"
    - "Government agencies"
training_and_resources:
  - "Cybersecurity awareness workshops"
  - "Online training modules"
  - "Security awareness newsletters"
  - "Incident response guides"
  - "Best practices checklists"
use_cases:
  - client_type: "Individual banking customer"
    scenario: "Receives phishing email claiming account compromise"
    response: "Follows verification protocol, contacts bank directly, reports incident"
    outcome: "Prevents account takeover and helps bank identify threat"
  - client_type: "Small business owner"
    scenario: "Employee reports suspicious email requesting wire transfer"
    response: "Implements verification procedure, discovers attempted fraud"
    outcome: "Prevents financial loss and strengthens security awareness"
  - client_type: "Corporate client"
    scenario: "Executive receives urgent request for sensitive information"
    response: "Follows company protocol, verifies through independent channel"
    outcome: "Prevents data breach and maintains security posture"
search_keywords: ["cybersecurity best practices", "digital security", "cyber hygiene", "security awareness", "fraud prevention", "data protection"]
```

---

## UBS.com/ch - Swiss Market Specific Information

### Private Clients

#### Accounts and Cards

##### Daily Banking

**Private Account/Adults/Key4** (also known as: key4 banking, digital banking package)
- UBS key4 banking starts at 0 CHF for Pure Package
- Attractive exchange rates worldwide with no processing fees
- Lightning-fast shopping: TWINT, Apple Pay, Google Pay, Samsung Pay
- Gold trading via smartphone from 0.1 grams
- Investment and retirement provision management directly in app
- Welcome gift: 50 KeyClub points worth CHF 50

**Key4 Basic Card**
```yaml
service_type: personal_banking
category: youth_banking
product_id: key4_basic
target_audience: "Students and young adults aged 12-30"
monthly_cost: "CHF 0"
promotional_offer: "Free for life for eligible youth"
includes:
  - "Personal account with IBAN"
  - "Savings account with competitive interest"
  - "Mobile banking access"
  - "E-banking platform"
cards:
  - "Prepaid card (Mastercard/Visa)"
  - "Debit card with contactless payment"
limits:
  - "Add up to CHF 10,000 per month"
  - "Daily ATM withdrawal: CHF 1,000"
  - "Daily payment limit: CHF 5,000"
use_cases:
  - "First bank account for students"
  - "Budget management for young adults"
  - "International travel with prepaid card"
  - "Online shopping and digital payments"
eligibility:
  - "Age 12-30 years"
  - "Swiss resident or student"
  - "Valid identification required"
search_keywords:
  - "student account"
  - "youth banking"
  - "free bank account"
  - "prepaid card"
```

**Key4 Pro Card**
```yaml
service_type: personal_banking
category: youth_banking
product_id: key4_pro
target_audience: "Young professionals and students with credit needs"
monthly_cost: "CHF 14"
promotional_offer: "First 6 months free"
includes:
  - "Personal account with premium features"
  - "High-yield savings account"
  - "Priority customer service"
  - "Enhanced mobile banking"
cards:
  - "Standard credit card (Mastercard/Visa)"
  - "Debit card with premium benefits"
credit_features:
  - "Credit limit: CHF 5,000 per month"
  - "Flexible repayment options"
  - "Competitive interest rates"
  - "Credit building opportunity"
insurance_coverage:
  - "Travel insurance up to CHF 100,000"
  - "Aviation accident insurance"
  - "Emergency medical coverage abroad"
  - "Trip cancellation protection"
rewards:
  - "2 KeyClub points per CHF 1,000 spent"
  - "Bonus points for specific merchants"
  - "Attractive exchange rates worldwide"
use_cases:
  - "Building credit history"
  - "International travel with insurance"
  - "Emergency financial flexibility"
  - "Reward earning on daily expenses"
eligibility:
  - "Age 18-30 years"
  - "Stable income or student status"
  - "Good credit assessment"
search_keywords:
  - "credit card for students"
  - "travel insurance"
  - "KeyClub points"
  - "young professional banking"
```

**Key4 Prime Card**
```yaml
service_type: personal_banking
category: premium_youth_banking
product_id: key4_prime
target_audience: "High-earning young professionals and frequent travelers"
monthly_cost: "CHF 22"
promotional_offer: "First 6 months free"
includes:
  - "Premium personal account"
  - "High-yield savings with bonus rates"
  - "Dedicated relationship manager"
  - "Premium mobile and e-banking"
cards:
  - "Premium credit card (Gold/Platinum)"
  - "Premium debit card with global acceptance"
credit_features:
  - "Credit limit: CHF 10,000 per month"
  - "Extended payment terms"
  - "Premium interest rates"
  - "Higher spending limits"
insurance_coverage:
  - "Comprehensive travel insurance up to CHF 200,000"
  - "Aviation accident insurance"
  - "Collision Damage Waiver for rental cars"
  - "Extended warranty protection"
  - "Purchase protection insurance"
premium_benefits:
  - "Priority Pass for 1,200+ airport lounges worldwide"
  - "Concierge services"
  - "Exclusive event invitations"
  - "Premium customer support 24/7"
rewards:
  - "4 KeyClub points per CHF 1,000 spent"
  - "Bonus categories with up to 8x points"
  - "Attractive exchange rates worldwide"
  - "No foreign transaction fees"
use_cases:
  - "Frequent international travel"
  - "Premium lifestyle banking"
  - "High-value purchases with protection"
  - "Maximizing rewards and benefits"
eligibility:
  - "Age 18-30 years"
  - "High income or substantial assets"
  - "Excellent credit history"
comparison_benefits:
  - "2x more KeyClub points than Pro"
  - "Airport lounge access (not available in Pro/Basic)"
  - "Higher credit limits and insurance coverage"
  - "Premium concierge services"
search_keywords:
  - "premium credit card"
  - "airport lounge access"
  - "travel benefits"
  - "concierge services"
  - "high credit limit"
```

---

*This knowledge base contains comprehensive information about UBS banking services, products, and offerings. All content is sourced from the official UBS website and maintains the original hierarchy and structure while being optimized for AI utilization with enhanced formatting, keywords, and cross-references.*