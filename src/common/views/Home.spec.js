import React from 'react';
import HomeView from './HomeView';
import App from '../../common/components/App/App';
import { BrowserRouter } from "react-router-dom";
import userEvent from '@testing-library/user-event'
import { cleanup, render, screen, waitFor } from '@testing-library/react'

beforeEach(() => {
  delete window.location;
  window.location = new URL('http://localhost/');
});

const mockFetch = (resolveValue) => {
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      json: () => Promise.resolve(resolveValue)
      })
    })
  }
  
test('render Homeview', async () => {
  render(<BrowserRouter><HomeView /></BrowserRouter>)

  const homeViewRoot = await screen.findByTestId('homeViewRoot')
  expect(homeViewRoot).toBeDefined()
})

test('Navigate to PaymentsView', async () => {
  mockFetch({})
  render(<BrowserRouter><App /></BrowserRouter>)

  const goToPaymentsLink = await screen.findByTestId(/navigateToPaymentsView/i);

  expect(goToPaymentsLink).toBeInTheDocument();
  userEvent.click(goToPaymentsLink);
  const paymentsViewRoot = await screen.findByTestId(/paymentsViewRoot/i)

  expect(paymentsViewRoot).toBeInTheDocument()
})

test('Navigate to NewPurchase', async () => {
  mockFetch({})
  render(<BrowserRouter><App /></BrowserRouter>)
  const goToNewPurchaseView = await screen.findByTestId(/navigateToNewPurchaseView/i);  

  expect(goToNewPurchaseView).toBeInTheDocument();
  userEvent.click(goToNewPurchaseView);

  const newPurchaseViewRoot = await screen.findByTestId(/newPurchaseViewRoot/i);

  expect(newPurchaseViewRoot).toBeInTheDocument();
})

test('Show total unpaid payments amount', async () => {          
  const mockedExpiredPayments = [
    {
      purchaseId: 1,
      amount: 1000,
      feeNumber: 1,
      purchaseDescription: 'Lavaropa',
      totalFees: 3
    }
  ]
  const mockedUpcomingPayments = [
    {
      purchaseId: 1,
      amount: 1000,
      feeNumber: 2,
      purchaseDescription: 'Lavaropa',
      totalFees: 3
    },
    {
      purchaseId: 1,
      amount: 1000,
      feeNumber: 3,
      purchaseDescription: 'Lavaropa',
      totalFees: 3
    }
  ]
  const resolveValue = { expiredPayments: mockedExpiredPayments, upcomingPayments: mockedUpcomingPayments }
  
  mockFetch(resolveValue);
  
  render(<BrowserRouter><HomeView /></BrowserRouter>)
  
  const totalUnpaidAmount = await screen.findByTestId(/totalUnpaidAmount/i);

  expect(totalUnpaidAmount.textContent).toBe('$ 2000');
})

test('Show total purchased amount', async () => {          
  const mockedExpiredPayments = [
    {
      purchaseId: 1,
      amount: 1000,
      feeNumber: 1,
      purchaseDescription: 'Lavaropa',
      totalFees: 3
    }
  ]
  const mockedUpcomingPayments = [
    {
      purchaseId: 1,
      amount: 1000,
      feeNumber: 2,
      purchaseDescription: 'Lavaropa',
      totalFees: 3
    },
    {
      purchaseId: 1,
      amount: 1000,
      feeNumber: 3,
      purchaseDescription: 'Lavaropa',
      totalFees: 3
    }
  ]
  const resolveValue = { expiredPayments: mockedExpiredPayments, upcomingPayments: mockedUpcomingPayments }
  
  mockFetch(resolveValue);
  render(<BrowserRouter><HomeView /></BrowserRouter>)
  
  const totalPurchasedAmount = await screen.findByTestId(/totalPurchasedAmount/i);
  expect(totalPurchasedAmount.textContent).toBe('$ 3000');
})
