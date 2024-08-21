import { useNavigate } from "react-router-dom";
import { SavedDatesContext } from "./savedDatesContext.jsx";
import "../../index.css";
import styles from "../../assets/css/historyDates.module.css";
import { useContext } from "react";

//============= 過去の履歴の表示 ====<p></p>================//
export const HistoryDates = () => {
  const navigate = useNavigate();
  const { savedDates, setSavedDates } = useContext(SavedDatesContext);

  // 全ての履歴の削除処理
  const handleAllDeleteDate = () => {
    const confirmDelete = window.confirm(
      "全ての履歴を削除します。よろしいですか？"
    );
    // 確認のち削除
    if (confirmDelete) {
      savedDates.forEach((date) => localStorage.removeItem(`list_${date}`));
      localStorage.removeItem("saved_dates");
      setSavedDates([]);
    }
  };

  // 指定された日付のリストを表示するためにナビゲート
  const handleLoadDate = (date) => {
    navigate("/historyList", {
      state: { date },
    });
  };

  // shoppingリストページに戻るためにナビゲート
  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
      <header className={styles.header}>
        <button
          className={styles["header__back-button"]}
          onClick={handleBackClick}
        >
          戻る
        </button>
        <h1 className={styles.header__title}>履歴一覧</h1>
      </header>
      <main>
        <ul className={styles.list}>
          <span className={styles["list__supplement-text"]}>
            ※30日経過したデータは自動的に削除されます
          </span>
          {savedDates.map((date) => (
            <li
              className={styles.list__item}
              key={date}
              onClick={() => handleLoadDate(date)}
            >
              <span className={styles["list__date-text"]}>{date}</span>
            </li>
          ))}
        </ul>

        <div className={styles["button-wrapper"]}>
          <button className={styles.button} onClick={handleAllDeleteDate}>
            削除
          </button>
        </div>
      </main>
    </>
  );
};
