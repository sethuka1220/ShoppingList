import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { SavedDatesContext } from "./savedDatesContext.jsx";
import { formatNumber } from "./module/formatNumber.js";
import { handleTotalPriceCalculation } from "./module/handleProductCalculation.js";
import { BsCart3, BsCartXFill } from "../../assets/icons/icons";
import styles from "../../assets/css/App.module.css";

//================リストアイテムの情報を管理するコンポーネント=====================//
const ProductListItem = ({
  item,
  list,
  setList,
  handleItemInputChange,
  isSwiped,
}) => {
  const [isFocusField, setIsFocusField] = useState(null); //各フィールドのフォーカス状態を管理するステート

  //リストアイテムの削除処理
  const handleDeleteClick = (id) => {
    const deleteItem = list.filter((item) => item.id !== id);
    setList(deleteItem);
  };

  //フォーカスアウト時の処理
  const handleBlurInput = (e, id, fieldName) => {
    setIsFocusField(null); //どのフィールドにもフォーカスされていない状態

    const { value } = e.target; // イベントオブジェクトから value を取得
    const numericValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);

    const updatedList = list.map((item) => {
      if (item.id === id) {
        // priceからフォーカスアウトされたときの処理
        if (fieldName === "price") {
          //数量が0でなければ、数量と金額を掛けた合計を返す。0なら素のvalueを返す
          return {
            ...item,
            price: numericValue,
            totalPrice:
              item.quantity !== 0 ? item.quantity * item.price : numericValue,
          }; //  quantityからフォーカスアウトされたときの処理
        } else if (fieldName === "quantity") {
          // 金額と更新された数量を再計算する
          return {
            ...item,
            quantity: numericValue,
            totalPrice: item.price * numericValue,
          }; //両方のフィールドからフォーカスが外れた場合の処理
        } else {
          // 入力欄が空の場合は 0 をデフォルト値として設定。それ以外は、valueを返す
          return {
            ...item,
            [fieldName]: value === "" ? 0 : numericValue,
          };
        }
      }
      return item;
    });
    setList(updatedList);
  };

  //入力欄がフォーカスされたときの処理
  const handleFocusInput = (e, fieldName, id) => {
    setIsFocusField(fieldName);

    const { value } = e.target; // イベントオブジェクトから valueを取得
    const numericValue = parseFloat(value); // value を数字に変換し変数に格納

    //フォーカス時、入力欄を空に更新
    if (value !== numericValue) {
      const updatedList = list.map((item) =>
        item.id === id
          ? {
              ...item,
              [fieldName]: "",
            }
          : item
      );
      setList(updatedList);
    }
  };

  return (
    <AnimatePresence>
      <div className={styles["list-wrap"]}>
        <motion.li
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: [0.5, 1] }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: [0.8, 0.4, null], scale: 0.5 }}
          drag="x"
          dragConstraints={{ left: -70, right: 0 }}
          dragElastic={0}
          className={styles.list__item}
        >
          <p className={styles["list__product-name"]}>{item.name}</p>
          <input
            type="text"
            name="quantity"
            onFocus={(e) => handleFocusInput(e, "quantity", item.id)}
            onChange={(e) => handleItemInputChange(e, item.id)}
            onBlur={(e) => handleBlurInput(e, item.id, "quantity")}
            value={item.quantity}
            className={styles.list__input}
          />
          <input
            type="text"
            name="price"
            onFocus={(e) => handleFocusInput(e, "price", item.id)}
            onBlur={(e) => handleBlurInput(e, item.id, "price")}
            onChange={(e) => handleItemInputChange(e, item.id)}
            value={
              isFocusField === "price"
                ? item.price
                : formatNumber(item.totalPrice)
            }
            className={styles.list__input}
          />
        </motion.li>
        <motion.div
          initial={{ opacity: 0, x: "50%" }}
          animate={{ opacity: 1, x: isSwiped ? 0 : "-50%" }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
          }}
          dragElastic={0}
          className={isSwiped ? styles.swipe : styles.hide}
        >
          <button
            className={styles["swipe__delete-btn"]}
            onClick={() => handleDeleteClick(item.id)}
          >
            <BsCartXFill className={styles.swipe__icon} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

//================== 商品の入力、追加を行うコンポーネント ======================//
const ShoppingInputForm = ({
  list,
  setList,
  setInputProduct,
  inputProduct,
}) => {
  //formに入力された値を更新する
  const handleInputChange = (e) => {
    setInputProduct(e.target.value);
  };

  //追加ボタンを押したときの処理
  const handleAddItem = () => {
    //inputが空の場合は追加出来ないようにする
    if (!inputProduct.trim()) return;

    // ステートにリストアイテムをセット
    setList([
      ...list, //listステートを展開
      {
        //productItemステートをリストアイテムとして追加
        id: uuidv4(), //id
        name: inputProduct, //商品名
        quantity: 0, //個数
        price: 0, //値段
        totalPrice: 0,
      },
    ]);

    setInputProduct(""); //入力フォームを空にする
  };

  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className={styles["add-field"]}
    >
      <input
        type="text"
        onChange={handleInputChange}
        value={inputProduct}
        placeholder="カートに追加するものを入力してください"
        className={styles["add-field__input"]}
      />
      <button
        type="button"
        onClick={handleAddItem}
        className={styles["add-btn"]}
      >
        <BsCart3 className={styles["add-btn__icon"]} /> {/*カートのアイコン */}
      </button>
    </form>
  );
};

//=================== リストの表示を行うコンポーネント ====================//
const List = ({ list, setList, handleItemInputChange }) => {
  const [isSwiped, setIsSwiped] = useState(false);

  //react-swipeableを使用してスワイプ操作を検出するための定義
  const handlers = useSwipeable({
    onSwipedLeft: () => setIsSwiped(true), //左にスワイプ
    onSwipedRight: () => setIsSwiped(false), //右スワイプ
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, //マウスによるスワイプも追跡
  });
  return (
    <ul role="list" className={styles.list} {...handlers}>
      {list.map((item) => (
        <ProductListItem
          key={item.id}
          item={item}
          list={list}
          setList={setList}
          handleItemInputChange={handleItemInputChange}
          isSwiped={isSwiped}
        />
      ))}
    </ul>
  );
};

//============ アプリ全体を管理するコンポーネント ==============//
export const App = () => {
  const [inputProduct, setInputProduct] = useState(""); //formに入力された値を保持する
  const [list, setList] = useState([]); //リストを配列として管理するステート
  const { savedDates, setSavedDates } = useContext(SavedDatesContext); //日付を保存するためのステート

  const navigate = useNavigate();

  // 過去のデータが1つ以上保存されている場合、期限切れのリストを自動削除する関数を呼び出す
  useEffect(() => {
    if (savedDates.length > 0) {
      deleteExpiredDates();
    }
  }, []);

  useEffect(() => {
    console.log(savedDates);
  });

  //リストをローカルストレージに保存
  const saveList = () => {
    const currentDate = new Date().toISOString().slice(0, 10); //日付だけ取得
    const serializedList = JSON.stringify(list); //json文字に置き換え

    // リストが空の場合、アラートで警告を出し保存が行われないようにする
    if (list.length === 0) {
      alert("保存する内容が存在しません。");
      return;
    }

    try {
      localStorage.setItem(`list_${currentDate}`, serializedList); //日付とリストをローカルストレージに保存

      //現在のデータがsavedDatesステートに存在していないか確認
      if (!savedDates.includes(currentDate)) {
        //新しくデータリストを作成
        const newSavedDates = [...savedDates, currentDate];
        setSavedDates(newSavedDates);

        //作成したデータリストをストレージにsaved_datesというキーで保存
        localStorage.setItem("saved_dates", JSON.stringify(newSavedDates));
      }
      alert("保存が完了しました");
    } catch (e) {
      console.error("ローカルストレージへの保存に失敗しました", e);
      alert("保存に失敗しました。詳細:" + e.message);
    }
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
    localStorage.setItem("saved_dates", JSON.stringify(filteredDates));

    // list_${date}キーで保存されている各リストに対しての処理
    //30日以上たったリストのみを抽出してローカルストレージから削除
    savedDates.forEach((date) => {
      if (!filteredDates.includes(date)) {
        localStorage.removeItem(`list_${date}`);
      }
    });
    // フィルタリングした要素でsavedDatesを更新
    setSavedDates(filteredDates);
  };

  //履歴ボタンクリックで過去リストの日付一覧画面に飛ぶ
  const handleHistoryDates = () => {
    navigate("/historyDates");
  };

  //リストアイテム入力欄の更新
  const handleItemInputChange = (e, id) => {
    const { name, value } = e.target; //イベントオフジェクトからnameとvalueを取得

    const numericValue = value.replace(/[^0-9０-９]/g, ""); //半角数字と全角数字以外を削除

    //バリデーションチェック: 数字以外が入力された場合、アラートで警告
    if (value !== "" && value !== numericValue) {
      //入力欄に数字以外が入力された場合、アラートで警告
      alert("無効な文字列です。数字を入力してください");
      return;
    } else {
      //全角数字で入力された場合、半角数字に変換
      const halfWidthValue = numericValue.replace(/[０-９]/g, (x) =>
        String.fromCharCode(x.charCodeAt(0) - 0xfee0)
      );

      const updatedList = list.map((item) =>
        item.id === id
          ? {
              ...item,
              [name]: halfWidthValue,
            }
          : item
      );
      setList(updatedList);
      return;
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles["header-container"]}>
          <button
            type="button"
            onClick={handleHistoryDates}
            className={styles["header-container__nav-btn"]}
          >
            履歴
          </button>

          <ShoppingInputForm
            list={list}
            setList={setList}
            inputProduct={inputProduct}
            setInputProduct={setInputProduct}
          />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.description}>
          <p className={styles["description__product-name"]}>商品名</p>
          <p className={styles["description__product-quantity"]}>数量</p>
          <p className={styles["description__product-price"]}>金額</p>
        </div>
        <List
          list={list}
          setList={setList}
          handleItemInputChange={handleItemInputChange}
        />
      </main>

      <footer className={styles.footer}>
        <span className={styles["footer-wrap__text"]}>
          <p>合計</p>
          <p className={styles["footer-wrap__calc-price"]}>
            {formatNumber(handleTotalPriceCalculation(list))}
          </p>
        </span>
        <button
          type="button"
          className={styles["footer__save-btn"]}
          onClick={saveList}
        >
          保存
        </button>
      </footer>
    </>
  );
};
