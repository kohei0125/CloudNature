import Image from "next/image";
import HeaderScrollEffect from "@/components/HeaderScrollEffect";
import ScrollReveal from "@/components/ScrollReveal";
import ConsultationForm from "@/components/ConsultationForm";
import JsonLd from "@/components/JsonLd";
import { MAIN_SITE_URL } from "@/lib/metadata";
import {
  FAQ_ITEMS,
  PROBLEM_CARDS,
  PROCESS_STEPS,
  STATS_ITEMS,
  organizationJsonLd,
  webPageJsonLd,
  faqPageJsonLd,
} from "@/content/ai-dev";

export default function TrainingPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={faqPageJsonLd} />

      <a className="skip-link" href="#main">
        本文へスキップ
      </a>

      <HeaderScrollEffect>
        <div className="container site-header__inner">
          <a className="site-header__logo" href={MAIN_SITE_URL}>
            <Image
              src="/images/logo-white.png"
              alt="CloudNature"
              width={130}
              height={30}
              priority
            />
          </a>
          <nav className="site-header__nav" aria-label="ページ内メニュー">
            <a href="#features">研修の特徴</a>
            <a href="#cases">実績・講師</a>
            <a href="#faq">よくある質問</a>
          </nav>
          <a className="btn btn--primary btn--header" href="#form">
            <span className="btn--header-label-full">30分無料相談を申し込む</span>
            <span className="btn--header-label-short">30分無料相談</span>{" "}
            <span aria-hidden="true">›</span>
          </a>
        </div>
      </HeaderScrollEffect>

      <main id="main">
        {/* ============ Hero ============ */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero__inner">
            <div className="hero__content">
              <p className="hero__badge">受託開発・SIer・IT企業の経営者 / CTO / 開発責任者向け</p>
              <h1 id="hero-title" className="hero__title">
                Claude Code / Codexを
                <br />
                顧客案件で安全に活用できる
                <br />
                <em className="hero__em">開発チームをつくる</em>
              </h1>
              <p className="hero__lead">
                貴社に合わせたAI開発研修をご提案します。単なるツール紹介ではなく、AIを組み込んだ開発プロセスの設計・運用・改善まで、実際の開発現場で得た実践ノウハウをお伝えします。
              </p>

              <p className="hero__gift">
                <span className="hero__gift-ico" aria-hidden="true">
                  <svg className="ico" viewBox="0 0 24 24">
                    <rect x="4" y="10" width="16" height="10" rx="1" />
                    <rect x="3" y="7" width="18" height="3" rx="1" />
                    <path d="M12 7v13M12 7c-1.4-2.8-4.8-2.9-4.8-1s3 1 4.8 1zM12 7c1.4-2.8 4.8-2.9 4.8-1s-3 1-4.8 1z" />
                  </svg>
                </span>
                ご相談内容をもとに、研修構成の概要案を無料でお渡しします
              </p>

              <div className="hero__actions">
                <a className="btn btn--primary btn--large" href="#form">
                  30分無料相談を申し込む <span aria-hidden="true">›</span>
                </a>
                <a className="btn btn--ghost btn--large" href="#agenda">
                  ご相談の流れを見る <span aria-hidden="true">›</span>
                </a>
              </div>
              <p className="hero__note">オンライン30分・相談無料。研修内容が未確定でもご相談いただけます。</p>
            </div>

            <div className="hero__visual" aria-hidden="true">
              <div className="editor">
                <div className="editor__titlebar">
                  <span className="editor__title">⌕  Claude Code</span>
                  <span className="editor__close">×</span>
                </div>
                <div className="editor__tabs">
                  <span className="editor__tab editor__tab--active">app.py</span>
                  <span className="editor__tab">utils.py</span>
                  <span className="editor__tab">README.md</span>
                </div>
                <div className="editor__body">
                  <pre className="editor__code">
                    <code>
                      <span className="ln">12</span><span className="tk-kw">def</span> <span className="tk-fn">analyze_sales</span>(data):
                      {"\n"}<span className="ln">13</span>    df = load_data(data)
                      {"\n"}<span className="ln">14</span>    summary = df.groupby(<span className="tk-str">&apos;product&apos;</span>).agg(
                      {"\n"}<span className="ln">15</span>        amount=(<span className="tk-str">&apos;amount&apos;</span>, <span className="tk-str">&apos;sum&apos;</span>),
                      {"\n"}<span className="ln">16</span>        orders=(<span className="tk-str">&apos;order_id&apos;</span>, <span className="tk-str">&apos;count&apos;</span>),
                      {"\n"}<span className="ln">17</span>    )
                      {"\n"}<span className="ln">18</span>    <span className="tk-kw">return</span> summary.sort_values(
                      {"\n"}<span className="ln">19</span>        by=<span className="tk-str">&apos;amount&apos;</span>, ascending=<span className="tk-kw">False</span>
                      {"\n"}<span className="ln">20</span>    )
                      {"\n"}<span className="ln">21</span>
                    </code>
                  </pre>
                  <aside className="editor__side">
                    <p className="editor__side-title">
                      <span className="editor__side-logo">⬡</span> Codex <span className="editor__side-icons">⤢  ⋮</span>
                    </p>
                    <p className="editor__side-label">◦ Plan</p>
                    <ul className="editor__plan">
                      <li>要件の整理</li>
                      <li>設計</li>
                      <li>実装</li>
                      <li>テスト</li>
                      <li>レビュー</li>
                      <li>ドキュメント更新</li>
                    </ul>
                    <div className="editor__run">
                      <p className="editor__run-title">
                        Running… <span className="editor__run-close">×</span>
                      </p>
                      <p className="editor__run-line">pytest -q</p>
                      <p className="editor__run-line editor__run-line--ok">
                        All tests passed <span className="editor__run-ok-badge">✓</span>
                      </p>
                    </div>
                  </aside>
                </div>
              </div>
              <div className="commit-card">
                <p className="commit-card__title">
                  Commit Message <span className="commit-card__close">×</span>
                </p>
                <p className="commit-card__msg">feat: 売上集計の最適化とテスト追加</p>
                <p className="commit-card__files">
                  Files changed <span className="commit-card__add">+132</span>{" "}
                  <span className="commit-card__bar" />{" "}
                  <span className="commit-card__avatars">
                    <span />
                    <span />
                  </span>{" "}
                  <span className="commit-card__btn">Commit</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Stats ============ */}
        <section className="stats" aria-label="実績サマリー">
          <div className="container">
            <div className="stats__marquee">
              <StatsList />
              <StatsList duplicate />
            </div>
          </div>
        </section>

        {/* ============ Problem ============ */}
        <section className="problem" aria-labelledby="problem-title">
          <div className="container">
            <h2 id="problem-title" className="section-title section-title--sparkle">
              <span className="spark spark--l" aria-hidden="true">
                ✦
              </span>
              AIツールは導入した。しかし、顧客案件で使う準備はできていますか
              <span className="spark spark--r" aria-hidden="true">
                ✦
              </span>
            </h2>
            <p className="section-lead">
              受託開発において、品質・セキュリティ・説明責任を満たしながらAIを活用するには、
              <br />
              ツール個別の使い方ではなく、開発プロセス全体の設計が必要です。
            </p>
            <div className="card-grid card-grid--3">
              {PROBLEM_CARDS.map((card) => (
                <article className="problem-card" key={card.title}>
                  <span className="problem-card__icon" aria-hidden="true">
                    <svg className="ico" viewBox="0 0 24 24">
                      {card.icon}
                    </svg>
                  </span>
                  <h3 className="problem-card__title">{card.title}</h3>
                  <p className="problem-card__text">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ Features (Value) ============ */}
        <section className="features" id="features" aria-labelledby="features-title">
          <div className="container">
            <div className="features__panel">
              <h2 id="features-title" className="section-title">
                必要なのは、ツールの操作法ではなく
                <br className="section-title__break" />
                AIを組み込んだ<em className="text-accent">開発プロセスの<span style={{ whiteSpace: "nowrap" }}>設計</span></em>です
              </h2>
              <div className="features__grid">
                <ul className="check-list check-list--lg">
                  <li>顧客案件で成果を出すための実践的な設計思想</li>
                  <li>要件定義〜レビュー・運用までの工程ごとに活用</li>
                  <li>チーム全体で再現性のある開発フローを構築</li>
                  <li>安全性・品質・コストをコントロールする運用設計</li>
                  <li>実案件に基づく具体例とテンプレートを提供</li>
                </ul>
                <div className="process">
                  <h3 className="process__title">人が判断・承認（ビジネス価値・品質・リスクを判断）</h3>
                  <ol className="process__flow">
                    {PROCESS_STEPS.flatMap((step, i) => [
                      i > 0 && (
                        <li className="process__arrow" aria-hidden="true" key={`arrow-${i}`}>
                          →
                        </li>
                      ),
                      <li className="process__step" key={i}>
                        <span className="process__icon" aria-hidden="true">
                          <svg className="ico" viewBox="0 0 24 24">
                            {step.icon}
                          </svg>
                        </span>
                        <span className="process__label">{step.label}</span>
                      </li>,
                    ])}
                  </ol>
                  <p className="process__note">  <strong>AI活用レイヤー</strong>（各工程にAIが伴走・提案・自動化を支援）</p>
                  {/* <p className="process__note">Claude Code / Codex / Claude 等の活用を組み込み</p> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Comparison ============ */}
        <section className="comparison" aria-labelledby="comparison-title">
          <div className="container">
            <h2 id="comparison-title" className="section-title">
              <span className="badge-check" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="11" fill="currentColor" stroke="none" />
                  <path
                    d="M7.5 12.5l3 3 6-6"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              ツール紹介で終わらない。顧客案件で使うところから逆算します。
            </h2>
            <div className="comparison__grid">
              <div className="table-wrap">
                <table className="comparison-table">
                  <caption className="sr-only">ツール操作を中心とした研修と本研修の比較</caption>
                  <thead>
                    <tr>
                      <th scope="col">比較項目</th>
                      <th scope="col">ツール操作を中心とした研修</th>
                      <th scope="col">本研修</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">主目的</th>
                      <td>ツールの使い方を知ること</td>
                      <td>顧客案件で安全に成果を出すこと</td>
                    </tr>
                    <tr>
                      <th scope="row">対象工程</th>
                      <td>一部の工程（実装中心）</td>
                      <td>要件定義〜実装〜レビュー〜テスト〜PRまで全工程</td>
                    </tr>
                    <tr>
                      <th scope="row">品質</th>
                      <td>プロンプトや個人の確認に依存しやすい</td>
                      <td>品質基準・レビュー・テストまで含めて管理</td>
                    </tr>
                    <tr>
                      <th scope="row">セキュリティ</th>
                      <td>一般的な注意事項の説明が中心</td>
                      <td>機密情報の扱い・社内ルール・説明責任まで実践</td>
                    </tr>
                    <tr>
                      <th scope="row">最終判断</th>
                      <td>各自の判断に委ねられる</td>
                      <td>人が判断と責任を持ち、自社で導入可否と進め方を決められる</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <aside className="compare-cta">
                <p className="compare-cta__copy">
                  貴社に合う研修構成が
                  <br />
                  <span className="marker">30分の無料相談</span>
                  <br />
                  分かります
                </p>
                <a className="btn btn--primary btn--large btn--block" href="#form">
                  30分無料相談を申し込む <span aria-hidden="true">›</span>
                </a>
                <p className="compare-cta__note">研修内容が未確定でもご相談いただけます</p>
              </aside>
            </div>
          </div>
        </section>

        {/* ============ Agenda & Benefits ============ */}
        <section className="agenda" id="agenda" aria-labelledby="agenda-title">
          <div className="container agenda__grid">
            <div className="panel">
              <h2 id="agenda-title" className="panel__title">
                ご相談の流れ（30分）
              </h2>
              <ol className="timeline">
                <li className="timeline__item timeline__item--active">
                  <p className="timeline__time">0 - 10分</p>
                  <h3 className="timeline__label">現状と課題のヒアリング</h3>
                  <p className="timeline__desc">開発体制・AI活用状況・お困りごとを伺います</p>
                </li>
                <li className="timeline__item">
                  <p className="timeline__time">10 - 20分</p>
                  <h3 className="timeline__label">AIを活かせる工程の整理</h3>
                  <p className="timeline__desc">効果が出やすい工程と品質・セキュリティの考え方を整理</p>
                </li>
                <li className="timeline__item">
                  <p className="timeline__time">20 - 30分</p>
                  <h3 className="timeline__label">研修構成のご提案・Q&amp;A</h3>
                  <p className="timeline__desc">貴社に合う研修構成・進め方のたたき台をご提案</p>
                </li>
              </ol>
              <p className="panel__note-plain">
                ※無理な売り込みは行いません。研修のご発注を前提としないご相談も歓迎です。
              </p>
            </div>

            <div className="panel">
              <h2 className="panel__title">ご相談で得られること</h2>
              <ul className="check-list check-list--lg">
                <li>顧客案件で使えるAI活用の方向性がわかる</li>
                <li>工程ごとの最適な使い分けを理解できる</li>
                <li>チーム導入・教育の進め方が整理できる</li>
                <li>品質・安全性・コストの考え方がわかる</li>
              </ul>
              <div className="benefit">
                <span className="benefit__icon" aria-hidden="true">
                  <svg className="ico" viewBox="0 0 24 24">
                    <rect x="4" y="10" width="16" height="10" rx="1" />
                    <rect x="3" y="7" width="18" height="3" rx="1" />
                    <path d="M12 7v13M12 7c-1.4-2.8-4.8-2.9-4.8-1s3 1 4.8 1zM12 7c1.4-2.8 4.8-2.9 4.8-1s-3 1-4.8 1z" />
                  </svg>
                </span>
                <div className="benefit__body">
                  <p className="benefit__eyebrow">相談特典</p>
                  <p className="benefit__title">研修構成案（たたき台）</p>
                  <p className="benefit__desc">
                    ご相談内容をもとに作成し、無料でお渡しします
                    （ご相談者限定）
                  </p>
                </div>
                <span className="benefit__art" aria-hidden="true">
                  <svg viewBox="0 0 52 44" className="art">
                    <rect x="4" y="4" width="24" height="32" rx="2" />
                    <rect x="22" y="9" width="24" height="30" rx="2" fill="#f7fbf9" />
                    <path d="M9 12h12M9 17h14M9 22h10M27 17h13M27 22h14M27 27h11M27 32h13" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Cases ============ */}
        <section className="cases" id="cases" aria-labelledby="cases-title">
          <div className="container">
            <div className="cases__panel">
              <h2 id="cases-title" className="section-title">
                講演実績
              </h2>
              <p className="section-lead">
                エンジニア・開発責任者の方々を対象に、AIを活用した開発プロセスの設計・実践をテーマとしたセミナー登壇や、企業向けのAI研修を実施してきました。要件定義から実装・レビュー・テストまで、各工程でAIをどう組み込み、品質やセキュリティをどう担保するかを、実際のデモや現場の事例を交えて解説しています。
              </p>
              <div className="talks">
                <figure className="talk-card">
                  <Image
                    className="talk-card__img"
                    src="/images/talk-seminar.webp"
                    alt="セミナー会場で大勢の参加者に向けて登壇し、スクリーンを使って講演する様子"
                    width={1920}
                    height={1016}
                  />
                </figure>
                <figure className="talk-card">
                  <Image
                    className="talk-card__img"
                    src="/images/talk-training.png"
                    alt="会議室で実施した企業向けAI研修の様子"
                    width={1448}
                    height={1086}
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Speaker ============ */}
        <section className="speaker" id="speaker" aria-labelledby="speaker-title">
          <div className="container">
            <div className="speaker__panel">
              <figure className="speaker__photo">
                <Image
                  src="/images/speaker.svg"
                  alt="講師 渡邉浩平のプロフィール写真"
                  width={200}
                  height={200}
                />
              </figure>
              <div className="speaker__info">
                <h2 id="speaker-title" className="speaker__eyebrow">
                  講師紹介
                </h2>
                <p className="speaker__name">
                  渡邉 浩平 <span className="speaker__name-en" translate="no">/ Kohei Watanabe</span>
                </p>
                <p className="speaker__role">株式会社クラウドネイチャー 代表</p>
                <p className="speaker__bio">
                  新潟のIT企業でキャリアをスタートし、その後独立し数十万人が毎日使うサービスの開発や大手企業のシステム構築に携わる。約10年の開発経験をもとに、2026年4月に株式会社クラウドネイチャーを設立。AI見積もりSaaS「ミツモリAI」をはじめとする自社プロダクト開発、受託システム開発、企業向けAI研修・セミナー登壇を手がける。
                </p>
              </div>
              <ul className="speaker__facts">
                <li>開発経験：約8年（SIer・フリーランス）</li>
                <li>自社AIプロダクト「ミツモリAI」開発・運営</li>
                <li>AI導入の実践ガイド記事を多数執筆</li>
                <li>企業向けAI研修・セミナー登壇（NAB主催セミナー等）</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============ Overview / FAQ / Form ============ */}
        <section className="application" id="faq" aria-labelledby="application-title">
          <h2 id="application-title" className="sr-only">
            相談概要・よくある質問・お申し込み
          </h2>
          <div className="container application__grid">
            <div className="panel panel--app">
              <h3 className="panel__band">相談概要</h3>
              <div className="panel__body">
                <table className="overview-table">
                  <caption className="sr-only">無料相談の概要</caption>
                  <tbody>
                    <tr>
                      <th scope="row">内容</th>
                      <td>開発現場で使えるAI研修の個別相談</td>
                    </tr>
                    <tr>
                      <th scope="row">形式</th>
                      <td>オンライン（Zoom）</td>
                    </tr>
                    <tr>
                      <th scope="row">所要時間</th>
                      <td>30分</td>
                    </tr>
                    <tr>
                      <th scope="row">費用</th>
                      <td>無料</td>
                    </tr>
                    <tr>
                      <th scope="row">ご相談対象</th>
                      <td>経営者 / CTO / 開発責任者 / 研修ご担当者</td>
                    </tr>
                    <tr>
                      <th scope="row">研修の受講対象</th>
                      <td>エンジニア / PM / テックリード</td>
                    </tr>
                    <tr>
                      <th scope="row">ご準備</th>
                      <td>不要（現状の共有だけで構いません）</td>
                    </tr>
                    <tr>
                      <th scope="row">担当</th>
                      <td>株式会社クラウドネイチャー（CloudNature Co., Ltd.）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel panel--app">
              <h3 className="panel__band">よくある質問</h3>
              <div className="panel__body">
                <div className="faq">
                  {FAQ_ITEMS.map((item) => (
                    <details className="faq__item" key={item.question}>
                      <summary className="faq__question">Q. {item.question}</summary>
                      <p className="faq__answer">{item.answer}</p>
                    </details>
                  ))}
                </div>
                <a className="btn btn--ghost-dark btn--block" href={`${MAIN_SITE_URL}/contact`}>
                  その他の質問はこちら <span aria-hidden="true">›</span>
                </a>
              </div>
            </div>

            <div className="panel panel--app" id="form">
              <h3 className="panel__band">無料相談のお申し込み</h3>
              <div className="panel__body">
                <ConsultationForm />
              </div>
            </div>
          </div>
        </section>

        {/* ============ Closing ============ */}
        <section className="closing" aria-labelledby="closing-title">
          <div className="container closing__inner">
            <h2 id="closing-title" className="closing__title">
              AIを「使う」から「成果を出す」へ。
              <br />
              まずは30分の無料相談で、貴社に合う研修構成を確かめてください。
            </h2>
            <p className="closing__note">オンライン30分・相談無料。研修内容が未確定でもご相談いただけます。</p>
            <a className="btn btn--primary btn--large" href="#form">
              30分無料相談を申し込む <span aria-hidden="true">›</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <a className="site-footer__logo" href={MAIN_SITE_URL}>
            <Image src="/images/logo-white.png" alt="CloudNature" width={122} height={28} />
          </a>
          <nav className="site-footer__links" aria-label="サイト情報">
            <a href={`${MAIN_SITE_URL}/company`}>会社概要</a>
            <a href={`${MAIN_SITE_URL}/privacy`}>プライバシーポリシー</a>
            <a href={`${MAIN_SITE_URL}/terms`}>利用規約</a>
            <a href={`${MAIN_SITE_URL}/contact`}>お問い合わせ</a>
          </nav>
          <p className="site-footer__copy">
            ※「Claude Code」はAnthropic、「Codex」はOpenAIの製品です。本研修および当社サービスは各社が主催・後援するものではありません。
          </p>
          <p className="site-footer__copy" translate="no">
            © 2026 CloudNature Co., Ltd. All Rights Reserved.
          </p>
        </div>
      </footer>

      <ScrollReveal />
    </>
  );
}

function StatsList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      className={duplicate ? "stats__list stats__list--dup" : "stats__list"}
      aria-hidden={duplicate || undefined}
    >
      {STATS_ITEMS.map((item) => (
        <li className="stats__item" key={item.label}>
          <span className="stats__icon">
            <svg className="ico" viewBox="0 0 24 24">
              {item.icon}
            </svg>
          </span>
          <div>
            <span className="stats__label">{item.label}</span>
            <strong className="stats__value">{item.value}</strong>
          </div>
        </li>
      ))}
    </ul>
  );
}
