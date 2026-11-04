import './JewelryCraftsmanship.css';

export function JewelryCraftsmanship() {
  return (
    <section id="jewelry-craftsmanship" className="jewelry-craftsmanship" aria-labelledby="jewelry-craftsmanship-title">
      <figure className="jewelry-craftsmanship__photo">
        <img src="/assets/craftsmanship/inner-detail-original.jpg" alt="نمای نزدیک از نقش و ظرافت ساخت در بخش داخلی انگشتر آموزگار" width={2160} height={2700} loading="lazy" decoding="async" />
      </figure>
      <div className="jewelry-craftsmanship__copy" dir="rtl">
        <span className="jewelry-craftsmanship__eyebrow">امضای آموزگار</span>
        <h2 id="jewelry-craftsmanship-title">زیبایی،<br />از درون آغاز می‌شود.</h2>
        <p>ظرافت، حتی در نادیدنی‌ترین جزئیات.<br />جواهری که از هر زاویه، روایتگر زیبایی شماست.</p>
      </div>
    </section>
  );
}