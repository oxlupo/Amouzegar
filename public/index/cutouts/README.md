# محصولات با پس‌زمینهٔ شفاف

| فایل | محصول | عکس اصلی |
| --- | --- | --- |
| `nora.png` | یک جفت گوشوارهٔ بادبزنی الماس | `Images/IMG_6082.JPG` |
| `astra.png` | انگشتر الماس با نگین‌های مربعی | `Images/IMG_6110.JPG` |
| `ruby.png` | انگشتر سنگ سرخ با هالهٔ الماس | `Images/109.jpg` |

خروجی‌ها PNG مربعی ۱۲۵۴ × ۱۲۵۴ با کانال آلفای واقعی‌اند. پس‌زمینه، لوگو و عناصر اطراف حذف شده‌اند. آدرس استفاده در سایت: `/index/cutouts/nora.png` و به همین ترتیب برای دو فایل دیگر. عکس‌های اصلی تغییر نکرده‌اند.

روش: ویرایش با ابزار داخلی `image_gen`، حالت `background-extraction` و `transparent_background=true`. این‌ها خروجی ویرایش هوش مصنوعی‌اند؛ ریزجزئیات و وضوح می‌توانند با عکس اصلی تفاوت داشته باشند. این خروجی‌ها ادعای مطابقت با شرط قدیمی ۱۶۰۰ پیکسل یا کمتر از ۵۰۰ کیلوبایت ندارند؛ فرمت JPG نیز شفافیت را حفظ نمی‌کند.

## Prompt set

Each source is the edit target. The exact shared prompt, replacing `{subject}` with the corresponding entry below:

> Edit the supplied photograph: professionally isolate ONLY {subject}. This is precise product background removal, NOT jewelry redesign or creative regeneration. Preserve the actual photographed product geometry, all stones, their settings, natural colors, details, highlights, relative arrangement and perspective. Remove the entire black background, ground surface, cast shadow, any ground reflection, brand logo, text and watermark outside the product. Make every non-product pixel fully transparent, including genuine gaps between metal and stones and any hole through a ring. Keep dark parts of the actual metal intact. Output a square high-resolution transparent PNG with the complete product centered, large and with roughly 12% clear transparent padding; no crop through jewelry, no invented stones, no pedestal, no checkerboard baked into image, no white or colored background. Do not add any objects.

- nora: `the pair of fan-shaped diamond earrings, both earrings together`
- astra: `the single square-faced diamond ring, including its complete band`
- ruby: `the single oval red ruby ring with its surrounding marquise diamond halo and visible ring band`
