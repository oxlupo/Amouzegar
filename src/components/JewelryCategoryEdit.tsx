import './JewelryCategoryEdit.css';

const CATEGORIES = [
  {id: 'engagement', title: 'انگشتر نامزدی', image: 0},
  {id: 'wedding-bands', title: 'حلقه‌های ازدواج', image: 1},
  {id: 'stud-earrings', title: 'گوشواره‌های میخی', image: 2},
  {id: 'tennis-bracelets', title: 'دستبند تنیس', image: 3},
];

interface JewelryCategoryEditProps {
  onNavigateToCategory: (category: string) => void;
}

export function JewelryCategoryEdit({onNavigateToCategory}: JewelryCategoryEditProps) {
  return (
    <section id="jewelry-category-edit" className="jewelry-category-edit" aria-labelledby="jewelry-category-edit-title" dir="rtl">
      <header className="jewelry-category-edit__heading">
        <span lang="en" dir="ltr" className="jewelry-category-edit__eyebrow">DIAMONDS</span>
        <h2 id="jewelry-category-edit-title">درخشش الماس، برای لحظه‌های ماندگار</h2>
        <p>از انگشتر نامزدی تا دستبند تنیس؛ جزئیاتی که نگاه را ماندگار می‌کنند.</p>
      </header>
      <div className="jewelry-category-edit__grid">
        {CATEGORIES.map(category => (
          <button key={category.id} type="button" className="jewelry-category-edit__item" onClick={() => onNavigateToCategory(category.id)}>
            <svg className="jewelry-category-edit__image" viewBox={`${category.image * 543} 150 543 480`} aria-hidden="true" focusable="false">
              <defs><clipPath id={`category-edit-clip-${category.image}`}><rect x={category.image * 543} y={150} width={543} height={480} /></clipPath></defs>
              <image href="/assets/category-edit/jewelry-row-white-gold-v3.webp" width="2172" height="724" clipPath={`url(#category-edit-clip-${category.image})`} />
            </svg>
            <span className="jewelry-category-edit__label">{category.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}