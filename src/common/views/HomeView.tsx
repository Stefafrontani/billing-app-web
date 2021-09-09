/** DEPENDENCIES */
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

/** TYPES */
import { IPayment } from '../../payments/types';

/** STYLES */
import styles from "./HomeView.module.scss";

interface IPurchasesAmounts {
  paid: number,
  unpaid: number
}

const HomeView = () => {
  const [ isLoadingPayments, setIsLoadingPayments ] = useState(false);
  const [ purchasesAmounts, setPurchasesAmounts ] = useState<IPurchasesAmounts>({ paid: 0, unpaid: 0 });
  
  const getPayments = () => {
    setIsLoadingPayments(true)
    return fetch('http://localhost:4001/payments')
    .then(res => res.json())
    .then((payments: { expiredPayments: IPayment[], upcomingPayments: IPayment[] } | null ) => {
      const expiredPayments= payments?.expiredPayments || [];
      const upcomingPayments = payments?.upcomingPayments || [];
      const upcomingDebt = upcomingPayments.reduce((acc, curr) => {
        return Number(acc) + Number(curr.amount)
      }, 0)
      
      const expiredDebt = expiredPayments.reduce((acc, curr) => {
        return Number(acc) + Number(curr.amount)
      }, 0)

      const newPurchasesAmounts = { unpaid: Math.round(upcomingDebt), paid: Math.round(expiredDebt) };
      setPurchasesAmounts(newPurchasesAmounts)
    })
    .finally(() => {
      setIsLoadingPayments(false)
    })
  }
  
  useEffect(() => {
    getPayments()
  }, [])

  const { unpaid, paid } = purchasesAmounts;

  return (
    isLoadingPayments
    ? <p>Loading...</p>
    : <div data-testid="homeViewRoot" className={styles.homeView}>
        <div className={styles.totals}>
          {
            (paid !== 0 && unpaid !== 0) 
              ? <div className={styles.totals__amounts}>
                <span data-testid="totalUnpaidAmount" className={styles.amounts__futurePayments}>$ {unpaid}</span>
                <span className={styles.amounts__bar}> / </span>
                <span data-testid="totalPurchasedAmount" className={styles.amounts__totalDebt}>$ {unpaid + paid}</span>
              </div>
              : null
          }
          <div className={styles.totals__details}>
            <Link data-testid="navigateToPaymentsView" to="/payments">Ver detalle</Link>
          </div>
        </div>
        <footer className={styles.footer}>
          <nav>
            <Link data-testid="navigateToNewPurchaseView" to="/new-purchase"><button>+</button></Link>
          </nav>
        </footer>
      </div>
  )
}

export default HomeView;