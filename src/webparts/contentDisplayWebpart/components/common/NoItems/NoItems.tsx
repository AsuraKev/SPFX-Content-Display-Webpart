import * as React from 'react';
import styles from './styles.module.scss';

export const NoItemsFound = () => {
    return(
        <div className={styles['wrapper']}>
            <span className={styles['icon-wrapper']}>
                <img src={require('../../../asset/img/miscellaneous/empty.svg')}/>
            </span>
            <p className={styles['msg-text']}>There is nothing to show here</p>
        </div>
    );
}