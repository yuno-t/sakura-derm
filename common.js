document.addEventListener("DOMContentLoaded", () => {
    // 1. ヘッダーの読み込み
    fetch('/header.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('header').innerHTML = html;
            // HTMLが挿入された「直後」にハンバーガーメニューの関数を実行する
            initHamburger();
        });

    // 2. フッターの読み込み
    fetch('/footer.html')
        .then(res => res.text())
        .then(html => document.getElementById('footer').innerHTML = html);

    // 3. タイトルの読み込み
    fetch('/lower-title.html')
        .then(res => res.text())
        .then(html => document.getElementById('lower-title').innerHTML = html);

    // 画面幅を広げたときSP用グロナビ非表示
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            const btn = document.getElementById('menu-btn');
            const nav = document.getElementById('nav-sp');

            if (btn) btn.classList.remove('isOpen');
            if (nav) nav.classList.remove('isOpen');
        }
    });
    // スクロールしたらヘッダー内のニュース非表示
    window.addEventListener('scroll', () => {
        const headerNews = document.querySelector('.header-news');

        if (headerNews) {
            // 現在のスクロール位置が600pxを超えた場合
            if (window.scrollY > 200) {
                headerNews.classList.add('isHidden'); // 消すためのクラスを追加
            } else {
                headerNews.classList.remove('isHidden'); // 600px未満ならクラスを削除
            }
        }
    });

});

function initHamburger() {
    const btn = document.getElementById('menu-btn');
    const nav = document.getElementById('nav-sp');
    if (btn && nav) {
        btn.addEventListener('click', () => {
            // ボタンとナビゲーションの両方に「isOpen」クラスを付け外しする
            btn.classList.toggle('isOpen');
            nav.classList.toggle('isOpen');
        });
    }
}