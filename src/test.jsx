import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// モックの保存データ
const mockSavedDates = [
  "2024-06-01",
  "2024-06-15",
  "2024-07-01",
  "2024-06-30",
  "2024-07-11",
];

const TestComponent = () => {
  const [savedDates, setSavedDates] = useState([]);

  //ハードコード用
  /* useEffect(() => {
    const pastDates = [
      "2024-07-05",
      "2024-07-08",
      "2024-07-10",
      "2024-07-12",
      "2024-07-16",
      "2024-07-17",
      "2024-07-19",
      "2024-07-24",
      "2024-07-25",
      "2024-07-29",
      "2024-07-31",
    ];
    setSavedDates(pastDates);
  }, []); */

  // モックデータを localStorage にセットする
  useEffect(() => {
    localStorage.setItem("test_dates", JSON.stringify(mockSavedDates));
    mockSavedDates.forEach((date) => {
      localStorage.setItem(`test_${date}`, `Content for ${date}`);
    });
    setSavedDates(mockSavedDates);
    //deleteExpiredDates();
  }, []);

  // 修正前の handleAllDeleteDate
  const handleAllDeleteDateBefore = () => {
    const confirmDelete = window.confirm(
      "全ての履歴を削除します。よろしいですか？"
    );
    if (confirmDelete) {
      const initializedDates = setSavedDates([]);
      localStorage.setItem("test_dates", JSON.stringify(initializedDates));

      savedDates.forEach((date) => localStorage.removeItem(`test_${date}`));
      setSavedDates([]);
    }
  };

  // 修正後の handleAllDeleteDate
  const handleAllDeleteDateAfter = () => {
    const confirmDelete = window.confirm(
      "全ての履歴を削除します。よろしいですか？"
    );
    if (confirmDelete) {
      savedDates.forEach((date) => localStorage.removeItem(`test_${date}`));
      localStorage.removeItem("test_dates");
      setSavedDates([]);
    }
  };

  // データの状態を表示するための関数
  const displayStorage = () => {
    console.log("saved_dates:", localStorage.getItem("test_dates"));
    mockSavedDates.forEach((date) => {
      console.log(`list_${date}:`, localStorage.getItem(`test_${date}`));
    });
  };

  // 30日以上たったリストは自動的に削除
  const deleteExpiredDates = () => {
    // savedDatesが空の場合、初期値として空の配列をセットし処理を中断させる
    if (savedDates.length === 0) {
      const initialList = [];
      localStorage.setItem("saved_dates", JSON.stringify(initialList));
      return;
    }
    const currentDate = new Date(); // 現在の日付を取得
    // 30日前の日付を取得
    const timeLimitDates = new Date();
    timeLimitDates.setDate(currentDate.getDate() - 30);

    // 30日以上経過したデータをフィルタリングして削除
    const filteredDates = savedDates.filter(
      (date) => new Date(date) > timeLimitDates
    );

    // saved_datesキーで保存されている配列をフィルタリングした日付で更新
    localStorage.setItem("test_dates", JSON.stringify(filteredDates));

    // list_${date}キーで保存されている各リストに対しての処理
    //30日以上たったリストのみを抽出してローカルストレージから削除
    savedDates.forEach((date) => {
      if (!filteredDates.includes(date)) {
        localStorage.removeItem(`test_${date}`);
      }
    });
    // フィルタリングした要素でsavedDatesを更新
    setSavedDates(filteredDates);
  };

  return (
    <div>
      <button
        style={{ color: "black", background: "green" }}
        onClick={handleAllDeleteDateBefore}
      >
        Run Before Code
      </button>
      <button
        style={{ color: "black", background: "blue" }}
        onClick={handleAllDeleteDateAfter}
      >
        Run After Code
      </button>
      <button
        style={{ color: "black", background: "red" }}
        onClick={displayStorage}
      >
        Display Local Storage
      </button>
      <button
        style={{ color: "black", background: "pink" }}
        onClick={deleteExpiredDates}
      >
        date for 30 expired
      </button>

      <ul role="list">
        {savedDates.map((date) => (
          <li key={uuidv4()}>{date}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestComponent;
