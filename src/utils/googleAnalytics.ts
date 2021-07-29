import Router from 'next/router'
import ReactGA from 'react-ga'

/**
 * Log a page view.
 *
 * @param {string} page Page URL
 */
export const logPageView = (page: string) => {
  ReactGA.set({ page })
  ReactGA.pageview(page)
}

/**
 * Log an event.
 *
 * @param {string} category
 * @param {string} action
 * @param {string?} label
 * @param {number?} value
 */
export const logEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  ReactGA.event({ category, action, label, value })
}

/**
 * Log an exception.
 *
 * @param {string} description
 * @param {boolean?} fatal
 */
export const logException = (description: string, fatal = false) => {
  ReactGA.exception({ description, fatal })
}

/**
 * Initialize Google Analytics.
 *
 * @param {string} trackingId Google Analytics ID
 */
export const initGA = (trackingId: string) => {
  ReactGA.initialize(trackingId, { debug: false })

  logPageView(window.location.href)
  Router.events.on('routeChangeComplete', (url) => {
    logPageView(url)
  })
}
