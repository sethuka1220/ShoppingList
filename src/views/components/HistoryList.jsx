import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { AnimatePresence, motion } from "framer-motion";
import { BiChevronDown } from "../../assets/icons/icons.js";
import { formatNumber } from "./module/formatNumber.js";
import { handleTotalPriceCalculation } from "./module/handleProductCalculation.js";
import "../../index.css";
import styles from "../../assets/css/historyList.module.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0.3, 0.5, 1],
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

//============ 過去のリストを表示する =================//
export const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const date = location.state.date;

  //ローカルストレージから各日付のデータを取得
  useEffect(() => {
    const serializedList = localStorage.getItem(`list_${date}`);

    //対応するデータが存在するか確認し、ある場合はオブジェクトに直してからステートにセット
    if (serializedList) {
      const list = JSON.parse(serializedList).map((item) => ({
        ...item,
        id: uuidv4(),
      }));
      setHistoryList(list);
      //対応するデータがない場合、アラートでメッセージを表示
    } else {
      alert("対応する日付のリストが見つかりませんでした");
      return;
    }
  }, [date]);

  // Appコンポーネントにナビゲート
  const handleHomeBackClick = () => {
    navigate("/");
  };
  // アコーディオン開閉の際の矢印の向きを制御する処理
  const handleToggleArrowAnimation = () => {
    //クリックされるたびに isDetailsOpenステート を切り替える
    setIsDetailsOpen((prevOpen) => !prevOpen);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.nav}>
          <button className={styles.nav__btn} onClick={handleHomeBackClick}>
            ホーム
          </button>
        </div>
        <h1 className={styles.header__title}>{`${date}の履歴`}</h1>
      </header>
      <main>
        <details
          className={styles.accordion}
          onClick={handleToggleArrowAnimation}
        >
          <summary className={styles["accordion_nav-text"]}>
            <motion.span
              animate={{ rotate: isDetailsOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <BiChevronDown className={styles.accordion_icon} />
            </motion.span>
            リスト内容を表示する
          </summary>
          <AnimatePresence>
            {isDetailsOpen && (
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={styles.list}
              >
                {historyList.map((item) => (
                  <motion.li
                    key={item.id}
                    variants={itemVariants}
                    className={styles.list__item}
                  >
                    <p className={styles["list__item-name"]}>{item.name}</p>
                    <p>{formatNumber(item.price * item.quantity)}</p>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </details>
        <AnimatePresence>
          {!isDetailsOpen && (
            <motion.div
              key="calc"
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: [0.7, 0.5, 0, null], y: 150 }}
              transition={{ duration: 0.5 }}
              className={styles.calc}
            >
              <p className={styles.calc__text}>支出</p>
              <p className={styles["calc__price-text"]}>
                {formatNumber(handleTotalPriceCalculation(historyList))}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
};
