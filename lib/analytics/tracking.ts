// Analytics tracking functions for the painting quote app

interface TrackingEvent {
  event: string
  [key: string]: any
}

// Push event to Google Tag Manager dataLayer
export function trackEvent(eventData: TrackingEvent) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(eventData)
    console.log('Analytics Event:', eventData)
  }
}

// Track page views
export function trackPageView(pagePath: string, pageTitle?: string) {
  trackEvent({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle || document.title,
  })
}

// Quote-related events
export function trackQuoteStarted(method: 'ai_chat' | 'manual' | 'quick_start') {
  trackEvent({
    event: 'begin_checkout',
    value: method,
    quote_method: method,
  })
}

export function trackQuoteCalculated(quoteAmount: number, projectType: string) {
  trackEvent({
    event: 'add_to_cart',
    value: quoteAmount,
    currency: 'USD',
    items: [{
      item_id: 'quote',
      item_name: 'Painting Quote',
      item_category: projectType,
      price: quoteAmount,
      quantity: 1,
    }],
  })
}

export function trackQuoteSaved(quoteId: string, quoteAmount: number, customerName: string) {
  trackEvent({
    event: 'purchase',
    transaction_id: quoteId,
    value: quoteAmount,
    currency: 'USD',
    customer_name: customerName,
    items: [{
      item_id: quoteId,
      item_name: 'Saved Quote',
      price: quoteAmount,
      quantity: 1,
    }],
  })
}

// Setup and onboarding events
export function trackSetupStarted(setupType: string) {
  trackEvent({
    event: 'tutorial_begin',
    setup_type: setupType,
  })
}

export function trackSetupCompleted(setupType: string, companyName: string) {
  trackEvent({
    event: 'tutorial_complete',
    setup_type: setupType,
    company_name: companyName,
  })
}

export function trackTrialSignup(companyName: string) {
  trackEvent({
    event: 'sign_up',
    method: 'trial',
    company_name: companyName,
  })
}

// Feature usage events
export function trackFeatureUsed(featureName: string, details?: any) {
  trackEvent({
    event: 'select_item',
    item_list_id: 'features',
    item_list_name: 'App Features',
    items: [{
      item_id: featureName,
      item_name: featureName,
      ...details,
    }],
  })
}

// Paint product selection
export function trackPaintSelected(productName: string, supplier: string, category: string) {
  trackEvent({
    event: 'view_item',
    items: [{
      item_id: productName,
      item_name: productName,
      item_brand: supplier,
      item_category: category,
    }],
  })
}

// Admin actions
export function trackAdminAction(action: string, details?: any) {
  trackEvent({
    event: 'admin_action',
    action_name: action,
    ...details,
  })
}

// Error tracking
export function trackError(errorType: string, errorMessage: string, context?: any) {
  trackEvent({
    event: 'exception',
    description: errorMessage,
    fatal: false,
    error_type: errorType,
    ...context,
  })
}

// Form interactions
export function trackFormStart(formName: string) {
  trackEvent({
    event: 'form_start',
    form_name: formName,
  })
}

export function trackFormSubmit(formName: string, success: boolean) {
  trackEvent({
    event: 'form_submit',
    form_name: formName,
    success: success,
  })
}

// Customer journey tracking
export function trackAccessCodeUsed(accessCode: string) {
  trackEvent({
    event: 'login',
    method: 'access_code',
    access_code: accessCode,
  })
}

export function trackDashboardViewed(companyId: string, quotesCount: number) {
  trackEvent({
    event: 'view_item_list',
    item_list_id: 'dashboard',
    item_list_name: 'Company Dashboard',
    company_id: companyId,
    quotes_count: quotesCount,
  })
}

// AI Chat interactions
export function trackChatMessage(messageType: 'user' | 'ai', messageLength: number) {
  trackEvent({
    event: 'chat_message',
    message_type: messageType,
    message_length: messageLength,
  })
}

export function trackChatQuoteReady(conversationLength: number) {
  trackEvent({
    event: 'chat_quote_ready',
    conversation_length: conversationLength,
  })
}