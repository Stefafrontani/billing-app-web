import React from 'react';
import PaymentsView from './PaymentsView';
import { BrowserRouter } from "react-router-dom";
import { render, screen } from '@testing-library/react'

const mockFetch = (resolveValue) => {
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      json: () => Promise.resolve(resolveValue)
      })
    })
  }

test('render PaymentsView', () => {
  render(<BrowserRouter><PaymentsView /></BrowserRouter>)

  const paymentsViewRoot = screen.getByTestId('paymentsViewRoot')
  expect(paymentsViewRoot).toBeDefined()
})

test('render Loading message initially', async () => {
  render(<BrowserRouter><PaymentsView /></BrowserRouter>)

  const loadingMessage = await screen.findByText('Loading...')
  expect(loadingMessage).toBeDefined()
})

test('render list of payments for each month', async () => {
  const mockedPaymentOne = {
    purchaseId: '1',
    expirationDate: new Date("2021-10-01T01:01:01.000Z"),
    amount: 1000,
    feeNumber: 7,
    purchaseDescription: "Mueble cocina blanco",
    totalFees: 12,
  };
  const mockedPaymentTwo = {
    purchaseId: '2',
    expirationDate: new Date("2021-11-01T01:01:01.000Z"),
    amount: 1000,
    feeNumber: 2,
    purchaseDescription: "Mueble cocina blanco",
    totalFees: 3,
  }
  const mockedExpiredPayments = []
  const mockedUpcomingPayments = [ mockedPaymentOne, mockedPaymentTwo ]
  const resolveValue = { expiredPayments: mockedExpiredPayments, upcomingPayments: mockedUpcomingPayments }
  
  mockFetch(resolveValue);

  render(<BrowserRouter><PaymentsView /></BrowserRouter>)

  // October month has a month value of 9
  const octoberPayments = await screen.findByTestId('monthPayments--2021-9');
  const novemberPayments = await screen.findByTestId('monthPayments--2021-10');
  expect(octoberPayments).toBeInTheDocument();
  expect(novemberPayments).toBeInTheDocument();
})

test('render corresponding payments for each month', async () => {
  const mockedOctoberPaymentOne = {
    purchaseId: '2',
    expirationDate: new Date("2021-09-01T01:01:01.000Z"),
    amount: 1000,
    feeNumber: 1,
    purchaseDescription: "Aire acondicionado",
    totalFees: 2,
  };
  const mockedOctoberPaymentTwo = {
    purchaseId: '2',
    expirationDate: new Date("2021-09-01T01:01:01.000Z"),
    amount: 2000,
    feeNumber: 1,
    purchaseDescription: "TV",
    totalFees: 2,
  }
  const mockedNovemberPaymentOne = {
    purchaseId: '2',
    expirationDate: new Date("2021-10-01T01:01:01.000Z"),
    amount: 10000,
    feeNumber: 2,
    purchaseDescription: "Aire acondicionado",
    totalFees: 2,
  };
  const mockedNovemberPaymentTwo = {
    purchaseId: '2',
    expirationDate: new Date("2021-10-01T01:01:01.000Z"),
    amount: 11000,
    feeNumber: 2,
    purchaseDescription: "TV",
    totalFees: 2,
  }
  const mockedExpiredPayments = []
  const mockedUpcomingPayments = [ mockedOctoberPaymentOne, mockedOctoberPaymentTwo, mockedNovemberPaymentOne, mockedNovemberPaymentTwo ]
  const resolveValue = { expiredPayments: mockedExpiredPayments, upcomingPayments: mockedUpcomingPayments }
  
  mockFetch(resolveValue);

  render(<BrowserRouter><PaymentsView /></BrowserRouter>)

  // October month has a month value of 9
  const octoberPaymntOneAmount = await screen.findByText('$ 1000');
  const octoberPaymntTwoAmount = await screen.findByText('$ 2000');
  const novemberPaymntOneAmount = await screen.findByText('$ 10000');
  const novemberPaymntTwoAmount = await screen.findByText('$ 11000');
  expect(octoberPaymntOneAmount).toBeInTheDocument();
  expect(octoberPaymntTwoAmount).toBeInTheDocument();
  expect(novemberPaymntOneAmount).toBeInTheDocument();
  expect(novemberPaymntTwoAmount).toBeInTheDocument();
})