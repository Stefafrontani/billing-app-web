/** DEPENDENCIES */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

/** TYPES */
import { IPurchase } from '../types';

/** STYLES */
import styles from './NewPuchaseView.module.scss'

interface INewPurchaseForm {
  boughtAt?: string,
  description?: string,
  amount?: number,
  fees?: number
}

const NewPurchaseView = () => {
  const [ formData, setFormData ] = useState<INewPurchaseForm>({});
  const [ isLoadingPurchaseCreation, setIsLoadingPurchaseCreation ] = useState(false);
  const history = useHistory();

  const handleFieldOnChange = (event: { target: HTMLInputElement }) => {
    const { target } = event;
    const { name, value } = target;
    setFormData({ ...formData, [name]: value })
  }

  const createNewPurhcase = () => {
    const { description, boughtAt, amount, fees } = formData;

    if (description && boughtAt && amount && fees) {
      const newPurchase: IPurchase = {    
        description: description,
        boughtAt: boughtAt,
        amount: Number(amount),
        fees: Number(fees)
      }
      setIsLoadingPurchaseCreation(true)
      return fetch('http://localhost:4000/purchases',
        {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(newPurchase)
        }
      )
        .then(res => res.json())
        .then(() => {
          setIsLoadingPurchaseCreation(false)
          history.push('/payments')
        })
    }

  }

  const checkValidForm = () => {
    return Boolean(formData.boughtAt && formData.description && formData.amount && formData.fees);
  }

  const isValidForm = checkValidForm();

  return (
    <div className={styles.newPurchaseView}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="purchase-boughtAt">Fecha: </label>
          <input onChange={handleFieldOnChange} type="date" id="purchase-boughtAt" name="boughtAt" />
        </div>
      </div>
      
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="purchase-description">Descripción:</label>
          <input onChange={handleFieldOnChange} type="text" id="purchase-description" name="description"/>
        </div>
      </div>

      <div className={`${styles.row} ${styles['row--columns']}`}>
        <div className={`${styles.field} ${styles['field--3']}`}>
          <label htmlFor="purchase-amount">Total: </label>
          <input onChange={handleFieldOnChange} type="number" id="purchase-amount" name="amount"/>
        </div>
        <div className={`${styles.field} ${styles['field--1']}`}>
          <label htmlFor="purchase-fees">Cuotas: </label>
          <input onChange={handleFieldOnChange} type="fees" id="purchase-fees" name="fees"/>
        </div>
      </div>
      
      <div className={styles.buttons}>
        <button onClick={createNewPurhcase} disabled={isLoadingPurchaseCreation || !isValidForm}>CRATE NEW PURCHASE</button>
      </div>
    </div>
  )
}

export default NewPurchaseView;