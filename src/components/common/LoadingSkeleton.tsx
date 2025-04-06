import Skeleton from 'react-loading-skeleton';
import styles from '../../assets/css/AnalyticsPage.module.css';

export function LoadingSkeleton({width, height}: { width: number, height: number }) {
    return (
        <>
            <h1><Skeleton width={300} height={40}/></h1>
            <div className={styles.columnContainer}>
                {/* Блок с тепловыми картами для gaze и mouse данных */}
                <div className={styles.rowContainer}>
                    <div>
                        <Skeleton height={height / 3} width={width / 3}/>
                        <p><Skeleton width={150}/></p>
                    </div>
                    <div>
                        <Skeleton height={height / 3} width={width / 3}/>
                        <p><Skeleton width={150}/></p>
                    </div>
                </div>
                {/* Блок с графиками корреляции */}
                <div className={styles.columnContainer}>
                    <p>
                        <Skeleton count={2}/>
                    </p>
                    <div className={styles.rowContainer}>
                        <div>
                            <Skeleton height={400} width={500}/>
                            <p><Skeleton width={200} count={2}/></p>
                        </div>
                        <div>
                            <Skeleton height={400} width={500}/>
                            <p><Skeleton width={200} count={2}/></p>
                        </div>
                        <div>
                            <Skeleton height={400} width={500}/>
                            <p><Skeleton width={200}/></p>
                        </div>
                    </div>
                </div>
                {/* Блок с тепловой картой для SI */}
                <div className={styles.columnContainer}>
                    <p>
                        <Skeleton count={1}/>
                    </p>
                    <div className={styles.rowContainer}>
                        <div>
                            <Skeleton height={height / 3} width={width / 3}/>
                            <p><Skeleton width={150}/></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
