import React from 'react';
import NewPurchaseView from './NewPurchaseView';
import { Router, BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import { createBrowserHistory } from 'history'

let mockFetch;

beforeEach(() => {
  mockFetch = (resolveValue) => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        json: () => Promise.resolve(resolveValue)
      })
    })
  }
  mockFetch({});
})

test('render NewPurchaseView', () => {
  render(<BrowserRouter><NewPurchaseView /></BrowserRouter>)

  const newPurchaseViewRoot = screen.getByTestId('newPurchaseViewRoot')
  expect(newPurchaseViewRoot).toBeDefined()
})

test('render disabled button', () => {
  render(<BrowserRouter><NewPurchaseView /></BrowserRouter>)

  const newPurchaseFormButton = screen.getByTestId('newPurchaseFormButton')
  expect(newPurchaseFormButton).toBeDisabled()
})

test('post new purchase', async () => {
  const history = createBrowserHistory();
  render(<Router history={history} ><NewPurchaseView /></Router >)

  const newPurchaseFormButton = screen.getByTestId('newPurchaseFormButton')
  expect(newPurchaseFormButton).toBeDisabled()

  const dateInput = screen.getByLabelText(/Fecha:/i)
  userEvent.type(dateInput, '2021-09-01')
  
  const descriptionInput = screen.getByLabelText(/Descripción:/i) 
  userEvent.type(descriptionInput, 'TV')
  
  const amountInput = screen.getByLabelText(/Total:/i)
  userEvent.type(amountInput, '1000')
  
  const feesInput = screen.getByLabelText(/Cuotas:/i)
  userEvent.type(feesInput, '1')

  expect(dateInput.value).toBe('2021-09-01')
  expect(descriptionInput.value).toBe('TV')
  expect(amountInput.value).toBe('1000')
  expect(feesInput.value).toBe('1')
  expect(newPurchaseFormButton).not.toBeDisabled();

  mockFetch();
  
  await waitFor(() => {
    fireEvent.click(newPurchaseFormButton)
  })

  expect(global.fetch).toHaveBeenCalled();
  expect(history.location.pathname).toBe('/payments');

})

