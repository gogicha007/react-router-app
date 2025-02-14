// import { useState } from 'react'

// // Use pre-typed versions of the React-Redux
// // `useDispatch` and `useSelector` hooks
// import { useAppDispatch, useAppSelector } from '@/app/hooks'
// import {
//   decrement,
//   increment,
//   incrementAsync,
//   incrementByAmount,
//   incrementIfOdd,
//   selectCount,
//   selectStatus
// } from './counterSlice'

// import styles from './Counter.module.css'

// export function Counter() {
//   const dispatch = useAppDispatch()
//   const count = useAppSelector(selectCount)
//   const status = useAppSelector(selectStatus)
//   const [incrementAmount, setIncrementAmount] = useState('2')

//   const incrementValue = Number(incrementAmount) || 0

//   return (
//     <div>
//       <div className={styles.row}>
//         <button
//           className={styles.button}
//           aria-label="Decrement value"
//           onClick={() => {
//             dispatch(decrement())
//           }}
//         >
//           -
//         </button>
//         <span aria-label="Count" className={styles.value}>
//           {count}
//         </span>
//         <button
//           className={styles.button}
//           aria-label="Increment value"
//           onClick={() => {
//             dispatch(increment())
//           }}
//         >
//           +
//         </button>
//         {/* omit additional rendering output here */}
//       </div>
//     </div>
//   )
// }