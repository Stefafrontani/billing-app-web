/** DEPENDENCIES */
import React from 'react';
import { Link } from "react-router-dom";

/** STYLES */
import styles from './AppContainer.module.scss'

interface IAppContainerProps {
  children: React.ReactNode
}

const AppContainer: React.FC<IAppContainerProps> = ({ children }: IAppContainerProps) => {
  return (
    <div className={styles.appContainer}>
      <header className={styles.appContainer__header}><nav><Link to="/">BILLING APP</Link></nav></header>
      <main className={styles.appContainer__content}>
        {children}
      </main>
    </div>
  )
}

export default AppContainer;