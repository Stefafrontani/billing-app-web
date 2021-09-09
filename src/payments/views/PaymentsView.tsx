/** DEPENDENCIES */
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

/** TYPES */
import { IPayment } from '../types'

/** STYLES */
import styles from './PaymentsView.module.scss';

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',]

interface IPaymentProps {
  payment: IPayment
}

interface PaymentsByMonth {
  [key: string]: {
    expirationDate: {
      value: Date,
      month: string,
      year: number
    }
    payments: IPayment[],
    totalAmount: number,
  }
}

const orderFuturePaymentsByYearAndMonth = (futurePayments: IPayment[]): PaymentsByMonth => {
  return futurePayments.reduce((acc: PaymentsByMonth, payment) => {
    const expirationDate = new Date(payment.expirationDate);
    const expirationMonth = expirationDate.getUTCMonth();
    const expirationYear = expirationDate.getUTCFullYear();

    const accKey = `${expirationYear}-${expirationMonth}`
    if (acc[accKey]) {
        acc[accKey] = { ...acc[accKey], totalAmount: Number(acc[accKey].totalAmount) + Number(payment.amount), payments: [ ...acc[accKey].payments, payment ] }
        
    } else {
        acc[accKey] = { expirationDate: { value: expirationDate, month: MONTHS[expirationMonth], year: expirationYear }, totalAmount: Number(payment.amount), payments: [ payment ] }
    }
    return acc
}, {})
}

const Payment: React.FC<IPaymentProps> = ({ payment }: IPaymentProps) => {
  const { amount, feeNumber, totalFees, purchaseDescription } = payment;
  const roundedAmount = Math.round(amount);
  return (
    <li className={styles.payment}>
      <header>
        <span className={styles.payment__feeNumber}>Cuota: {feeNumber}/{totalFees}</span>
        <span className={styles.payment__price}>$ {roundedAmount}</span>
      </header>
      <section>
        <p className={styles.payment__description}>{purchaseDescription}</p>
      </section>
    </li>
  )
}

const PaymentsView = () => {
  const [ isLoadingPayments, setIsLoadingPayments ] = useState(false);
  const [ payments, setPayments ] = useState<IPayment[]>([]);
  
  const getFuturePayments = () => {
    setIsLoadingPayments(true)
    return fetch('http://localhost:4001/payments')
    .then(res => res.json())
    .then(payments => {
      setPayments(payments.upcomingPayments)
    })
    .finally(() => {
      setIsLoadingPayments(false)
    })
  }
  
  useEffect(() => {
    getFuturePayments()
  }, [])
  
  const orderedFuturePayments = (payments && payments.length) && orderFuturePaymentsByYearAndMonth(payments)

  return (
    <div data-testid="paymentsViewRoot" className={styles.paymentsView}>
      {!isLoadingPayments
        ? orderedFuturePayments 
          ? <section className={styles.content}>
              <ul className={styles.monthPayments}>
              {Object.keys(orderedFuturePayments).map((key, index) => {
                const paymentsByMonthAndYear = orderedFuturePayments[key];
                return (
                  <li data-testid={`monthPayments--${key}`} key={index} className={styles.monthPayment}>
                    <p className={styles.paymentsTitle}>{`${paymentsByMonthAndYear.expirationDate.month} (${paymentsByMonthAndYear.expirationDate.year})`}<span>$ {Math.round(paymentsByMonthAndYear.totalAmount)}</span></p>
                    <ul className={styles.paymentsList}>
                      {paymentsByMonthAndYear.payments.map((payment, index) => {
                        return <Payment key={index} payment={payment}/>
                      })}
                    </ul>
                  </li>
                )
              })}
            </ul>
          </section>
          :  <p className={styles.paymentsTitle}>No hay payments futuros</p>
        : <p className={styles.loadingText}>Loading...</p>
      }
      <footer className={styles.footer}>
        <nav>
          <Link to="/new-purchase"><button>+</button></Link>
        </nav>
      </footer>
    </div>
  )
}

export default PaymentsView;