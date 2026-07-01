//ローディング画面
window.addEventListener('DOMContentLoaded', () => {
  const loading = document.querySelector('.loading');
  const loadingInner = document.querySelector('.loading-inner');
  const copy01 = document.querySelector('.loading-copy-01');
  const copy02 = document.querySelector('.loading-copy-02');
  const copy03 = document.querySelector('.loading-copy-03');
  const loadingLogo = document.querySelector('.loading-logo');
  const loadingAll = document.querySelector('.loading-all');

  const DELAYS = {
    copy01: 200,
    copy02: 600,
    copy03: 1000,
    loadingLogo: 1400,
    leave: 2500
  };

  // ===================================================
  // 1. 全ページ共通：画面に .loading-all があれば即座にクラスを付与
  // ===================================================
  if (loadingAll) {
    loadingAll.classList.add('is-leave');
  }

  // ===================================================
  // 2. トップページ専用： .loading がある場合のみ実行
  // ===================================================
  if (loading) {
    
    // 一度表示したらその日は表示しない判定
    const today = new Date().toLocaleDateString();
    const hasSeenLoading = localStorage.getItem('loading_seen_date');
    if (hasSeenLoading === today) {
      loading.style.display = 'none';
      return; // ここで処理を終了（下層ページには影響しません）
    }

    // 各パーツの表示処理（トップページのみ）
    if (loadingInner) loadingInner.classList.add('is-active');

    if (copy01) setTimeout(() => copy01.classList.add('is-active'), DELAYS.copy01);
    if (copy02) setTimeout(() => copy02.classList.add('is-active'), DELAYS.copy02);
    if (copy03) setTimeout(() => copy03.classList.add('is-active'), DELAYS.copy03);
    if (loadingLogo) setTimeout(() => loadingLogo.classList.add('is-active'), DELAYS.loadingLogo);

    // タイマーが来たらローディング画面を消去
    setTimeout(() => {
      loading.classList.add('is-leave');
      localStorage.setItem('loading_seen_date', today);
    }, DELAYS.leave);
  }
});

// ふわっと現れる

document.addEventListener('DOMContentLoaded', () => {
  // 1. 監視対象となる要素（.fade-in-up）をすべて取得
  const targetElements = document.querySelectorAll('.fade-in-up');

  // 2. オプションの設定
  const options = {
    root: null,         /* 今回はビューポート（画面全体）を基準にする */
    rootMargin: '0px',  /* 基準の境界線の拡張・縮小（なし） */
    threshold: 0.2      /* 要素が20%画面に入ったら実行する */
  };

  // 3. 画面内に入ったとき・出たときに実行するコールバック関数
  const callback = (entries, observer) => {
    entries.forEach(entry => {
      // entry.isIntersecting は要素が画面内に入っているかどうかを真偽値（true/false）で返す
      if (entry.isIntersecting) {
        // 画面に入ったら 'is-active' クラスを追加
        entry.target.classList.add('is-active');

        // 一度アニメーションしたら監視を解除する場合（1回きりの動きにしたい時）
        observer.unobserve(entry.target);
      }
    });
  };

  // 4. Intersection Observer のインスタンスを作成
  const observer = new IntersectionObserver(callback, options);

  // 5. 取得したすべての要素を監視対象に登録
  targetElements.forEach(element => {
    observer.observe(element);
  });
});


// GSAPとScrollTriggerの登録
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. 背景の円を大きくする演出
// ==========================================
gsap.to(".policy-inner", {
  // CSS変数の値を変化させる
  "--circle-width": "240%",

  scrollTrigger: {
    trigger: ".policy-inner",     // アニメーションの発火基準となる要素
    start: "top bottom",          // .policy-inner の「上端」が画面の「下端」に入った瞬間からスタート
    end: "bottom top+=500px",     // .policy-inner の「下端」が画面の「上端」から出ていくところで終了
    scrub: true,                  // スクロール量とアニメーションを完全に同期させる
  }
});



// // ==========================================
// // 3. 3番目（最後）のカードを画面幅に応じてスクロール固定する演出
// // ==========================================
// // 最後の要素を取得
const lastCard = document.querySelector('.policy-item:nth-of-type(3)');

// 画面幅に応じた分岐を設定
ScrollTrigger.matchMedia({

  // PC版：画面幅が769px以上のとき
  "(min-width: 769px)": function () {
    // ScrollTrigger.create の代わりに gsap.to を使って、固定と同時に縮小させます
    gsap.to(lastCard, {
      // scale: 0.98, // 固定されている間に本来の大きさの 0.98倍（お好みで調整）に少し縮小
      
      scrollTrigger: {
        trigger: lastCard,
        start: "top 530px",  // カードの上端（top）が画面上から310pxの位置に来たら固定
        end: "+=800px",      // 固定する長さ
        pin: true,
        pinSpacing: true,
        scrub: true,         // スクロール量に合わせて縮小を連動させる（重要！）
        anticipatePin: 1,    // 固定解除時のガタつき・ワープ防止策
      }
    });
  },

  // SP版：画面幅が768px以下のとき
  "(max-width: 768px)": function () {
    gsap.to(lastCard, {
      scale: 0.98, // SP版も同様に少し縮小
      
      scrollTrigger: {
        trigger: lastCard,
        start: "top 480px",  // カードの上端（top）が画面上から220pxの位置に来たら固定
        end: "+=400px",      // 固定する長さ
        pin: true,
        pinSpacing: true,
        scrub: true,         // スクロール量に合わせて縮小を連動させる
        anticipatePin: 1,    // 固定解除時のガタつき・ワープ防止策
      }
    });
  }

});


// トップページ　院内紹介　スライド
window.addEventListener('load', () => {
  const container = document.querySelector('.clinic-container');
  const arrowLeft = document.querySelector('.clinic-arrow-left');
  const arrowRight = document.querySelector('.clinic-arrow-right');

  // 要素が存在しない場合は処理を抜ける
  if (!container || !arrowLeft || !arrowRight) return;

  // 移動量を計算する関数（liの横幅 + gap）
  const getItemWidth = () => {
    const li = container.querySelector('li');
    if (!li) return 0;

    // liの横幅を取得
    const liWidth = li.getBoundingClientRect().width;
    // CSSのgap（32px）をリアルタイムに取得
    const gap = parseFloat(window.getComputedStyle(container).gap) || 0;

    return liWidth + gap;
  };

  // ---------------------------------------------
  // ① 矢印ボタンクリック（左端ぴったりに吸い付く動き）
  // ---------------------------------------------
  arrowRight.addEventListener('click', () => {
    const itemWidth = getItemWidth();
    // 現在の位置から、次の要素のインデックスを計算
    const currentIndex = Math.floor(container.scrollLeft / itemWidth);

    container.scrollTo({
      left: (currentIndex + 1) * itemWidth,
      behavior: 'smooth'
    });
  });

  arrowLeft.addEventListener('click', () => {
    const itemWidth = getItemWidth();
    // 現在の位置から、1つ前の要素のインデックスを計算
    const currentIndex = Math.ceil(container.scrollLeft / itemWidth);

    container.scrollTo({
      left: (currentIndex - 1) * itemWidth,
      behavior: 'smooth'
    });
  });

  // ---------------------------------------------
  // ② PCブラウザでのマウスドラッグによる横スクロール
  // ---------------------------------------------
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('is-dragging');
    // ドラッグ中のカクつき防止のため、一時的にスムーズスクロールを無効化
    container.style.scrollBehavior = 'auto';

    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    if (!isDown) return;
    isDown = false;
    container.classList.remove('is-dragging');
    container.style.scrollBehavior = 'smooth';
  });

  container.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    container.classList.remove('is-dragging');
    container.style.scrollBehavior = 'smooth';
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();

    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // スクロール速度の倍率（好みに応じて調整）
    container.scrollLeft = scrollLeft - walk;
  });
});



// FAQ開閉

document.querySelectorAll('.faq-item').forEach((targetDetails) => {
  const summary = targetDetails.querySelector('.faq-q');
  const answer = targetDetails.querySelector('.faq-a');

  summary.addEventListener('click', (e) => {
    e.preventDefault();

    const isOpen = targetDetails.hasAttribute('open');

    if (isOpen) {
      // 【1. 自分自身を閉じるときの処理】
      answer.style.gridTemplateRows = '0fr';
      setTimeout(() => {
        targetDetails.removeAttribute('open');
        answer.style.gridTemplateRows = ''; // スタイルをリセット
      }, 300);
    } else {
      // 【2. 自分自身を開くときの処理】

      // まず、他の開いているFAQをすべて閉じる
      document.querySelectorAll('.faq-item').forEach((otherDetails) => {
        if (otherDetails !== targetDetails && otherDetails.hasAttribute('open')) {
          const otherAnswer = otherDetails.querySelector('.faq-a');
          if (otherAnswer) {
            otherAnswer.style.gridTemplateRows = '0fr';
            setTimeout(() => {
              otherDetails.removeAttribute('open');
              otherAnswer.style.gridTemplateRows = '';
            }, 300);
          }
        }
      });

      // ★【ここを修正】1回目からアニメーションを確実に効かせるための処理
      // ① まず「高さ0fr」の状態で open 属性をつける
      answer.style.gridTemplateRows = '0fr';
      targetDetails.setAttribute('open', '');

      // ② ブラウザに「今、高さ0frで開いた状態になった」ことを強制的に認識させる（リフローのトリガー）
      // ※answer.offsetHeight を1回読み込ませるだけで、ブラウザの描画準備が整います
      answer.offsetHeight;

      // ③ 直後にスタイルをリセットすることで、CSSの「1fr」へ向けて0.3秒のアニメーションが確実に始まります
      answer.style.gridTemplateRows = '';
    }
  });
});





